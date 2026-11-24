import * as SQLite from 'expo-sqlite';
import { CITAS_INICIALES } from '../data/citas';
import { MASCOTAS_INICIALES } from '../data/mascotas';
import { SOLICITUDES_INICIALES } from '../data/solicitudes';
import { notificarCambioLocal } from './databaseEvents';

export type TipoRegistroLocal = 'mascotas' | 'citas' | 'solicitudes';
export type OperacionPendiente = {
  id: number;
  tipo: TipoRegistroLocal;
  registroId: string;
  operacion: 'guardar' | 'eliminar';
  datos: string | null;
  ownerUid: string | null;
};

type FilaRegistro = { id: string; datos: string; sync_status: string; updated_at: string };
let dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

const TABLAS: Record<TipoRegistroLocal, string> = {
  mascotas: 'mascotas',
  citas: 'citas',
  solicitudes: 'solicitudes',
};

export function abrirBaseDatos(): Promise<SQLite.SQLiteDatabase> {
  if (!dbPromise) dbPromise = inicializar();
  return dbPromise;
}

async function inicializar() {
  const db = await SQLite.openDatabaseAsync('mrpatitas.db');
  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS mascotas (
      id TEXT PRIMARY KEY NOT NULL,
      datos TEXT NOT NULL,
      sync_status TEXT NOT NULL DEFAULT 'pendiente',
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS citas (
      id TEXT PRIMARY KEY NOT NULL,
      datos TEXT NOT NULL,
      sync_status TEXT NOT NULL DEFAULT 'pendiente',
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS solicitudes (
      id TEXT PRIMARY KEY NOT NULL,
      datos TEXT NOT NULL,
      sync_status TEXT NOT NULL DEFAULT 'pendiente',
      updated_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sync_outbox (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      registro_id TEXT NOT NULL,
      operacion TEXT NOT NULL,
      datos TEXT,
      owner_uid TEXT,
      creado_en TEXT NOT NULL,
      UNIQUE(tipo, registro_id)
    );
  `);
  try {
    await db.execAsync('ALTER TABLE sync_outbox ADD COLUMN owner_uid TEXT');
  } catch {
    /* La columna ya existe. */
  }

  await sembrarSiVacio(db, 'mascotas', MASCOTAS_INICIALES);
  await sembrarSiVacio(db, 'citas', CITAS_INICIALES);
  await sembrarSiVacio(db, 'solicitudes', SOLICITUDES_INICIALES);
  return db;
}

async function sembrarSiVacio<T extends { id: string }>(db: SQLite.SQLiteDatabase, tabla: TipoRegistroLocal, registros: T[]) {
  const resultado = await db.getFirstAsync<{ total: number }>(`SELECT COUNT(*) AS total FROM ${TABLAS[tabla]}`);
  if ((resultado?.total ?? 0) > 0) return;
  const ahora = new Date().toISOString();
  await db.withTransactionAsync(async () => {
    for (const registro of registros) {
      await db.runAsync(
        `INSERT OR IGNORE INTO ${TABLAS[tabla]} (id, datos, sync_status, updated_at) VALUES (?, ?, 'local', ?)`,
        registro.id,
        JSON.stringify(registro),
        ahora,
      );
    }
  });
}

export async function obtenerRegistros<T>(tipo: TipoRegistroLocal): Promise<T[]> {
  const db = await abrirBaseDatos();
  const filas = await db.getAllAsync<FilaRegistro>(
    `SELECT id, datos, sync_status, updated_at FROM ${TABLAS[tipo]} ORDER BY updated_at DESC`,
  );
  return filas.map(fila => JSON.parse(fila.datos) as T);
}

export async function guardarRegistro<T extends { id: string }>(
  tipo: TipoRegistroLocal,
  registro: T,
  ownerUid?: string | null,
): Promise<void> {
  const db = await abrirBaseDatos();
  const ahora = new Date().toISOString();
  const datos = JSON.stringify(registro);
  await db.runAsync(
    `INSERT INTO ${TABLAS[tipo]} (id, datos, sync_status, updated_at) VALUES (?, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET datos = excluded.datos, sync_status = excluded.sync_status, updated_at = excluded.updated_at`,
    registro.id,
    datos,
    ownerUid ? 'pendiente' : 'local',
    ahora,
  );
  if (ownerUid) {
    await db.runAsync(
      `INSERT INTO sync_outbox (tipo, registro_id, operacion, datos, owner_uid, creado_en) VALUES (?, ?, 'guardar', ?, ?, ?)
       ON CONFLICT(tipo, registro_id) DO UPDATE SET operacion = 'guardar', datos = excluded.datos, owner_uid = excluded.owner_uid, creado_en = excluded.creado_en`,
      tipo,
      registro.id,
      datos,
      ownerUid,
      ahora,
    );
  } else {
    await db.runAsync('DELETE FROM sync_outbox WHERE tipo = ? AND registro_id = ?', tipo, registro.id);
  }
}

export async function eliminarRegistro(tipo: TipoRegistroLocal, id: string, ownerUid?: string | null): Promise<void> {
  const db = await abrirBaseDatos();
  const ahora = new Date().toISOString();
  const existente = await db.getFirstAsync<{ sync_status: string }>(`SELECT sync_status FROM ${TABLAS[tipo]} WHERE id = ?`, id);
  await db.runAsync(`DELETE FROM ${TABLAS[tipo]} WHERE id = ?`, id);
  if (existente?.sync_status === 'sincronizado' && ownerUid) {
    await db.runAsync(
      `INSERT INTO sync_outbox (tipo, registro_id, operacion, datos, owner_uid, creado_en) VALUES (?, ?, 'eliminar', NULL, ?, ?)
       ON CONFLICT(tipo, registro_id) DO UPDATE SET operacion = 'eliminar', datos = NULL, owner_uid = excluded.owner_uid, creado_en = excluded.creado_en`,
      tipo,
      id,
      ownerUid,
      ahora,
    );
  } else {
    // Si el registro nunca llegó a la nube, cancelamos la operación pendiente en vez de crear un borrado remoto.
    await db.runAsync('DELETE FROM sync_outbox WHERE tipo = ? AND registro_id = ?', tipo, id);
  }
}

export async function obtenerPendientesSincronizacion(ownerUid: string): Promise<OperacionPendiente[]> {
  const db = await abrirBaseDatos();
  return db.getAllAsync<OperacionPendiente>(
    'SELECT id, tipo, registro_id AS registroId, operacion, datos, owner_uid AS ownerUid FROM sync_outbox WHERE owner_uid = ? ORDER BY id ASC',
    ownerUid,
  );
}

export async function marcarSincronizado(pendiente: OperacionPendiente): Promise<void> {
  const db = await abrirBaseDatos();
  await db.runAsync('DELETE FROM sync_outbox WHERE id = ?', pendiente.id);
  if (pendiente.operacion === 'guardar') {
    await db.runAsync(`UPDATE ${TABLAS[pendiente.tipo]} SET sync_status = 'sincronizado' WHERE id = ?`, pendiente.registroId);
  }
}

export async function contarPendientesSincronizacion(ownerUid?: string): Promise<number> {
  const db = await abrirBaseDatos();
  const resultado = ownerUid
    ? await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) AS total FROM sync_outbox WHERE owner_uid = ?', ownerUid)
    : await db.getFirstAsync<{ total: number }>('SELECT COUNT(*) AS total FROM sync_outbox');
  return resultado?.total ?? 0;
}

export async function guardarRegistroDesdeNube<T extends { id: string }>(tipo: TipoRegistroLocal, registro: T): Promise<void> {
  const db = await abrirBaseDatos();
  const pendiente = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM sync_outbox WHERE tipo = ? AND registro_id = ?',
    tipo,
    registro.id,
  );
  if (pendiente) return;
  await db.runAsync(
    `INSERT INTO ${TABLAS[tipo]} (id, datos, sync_status, updated_at) VALUES (?, ?, 'sincronizado', ?)
     ON CONFLICT(id) DO UPDATE SET datos = excluded.datos, sync_status = 'sincronizado', updated_at = excluded.updated_at`,
    registro.id,
    JSON.stringify(registro),
    new Date().toISOString(),
  );
  notificarCambioLocal(tipo);
}

export async function eliminarSincronizadosAusentes(tipo: TipoRegistroLocal, idsEnNube: string[]): Promise<void> {
  const db = await abrirBaseDatos();
  const enNube = new Set(idsEnNube);
  const locales = await db.getAllAsync<{ id: string }>(
    `SELECT id FROM ${TABLAS[tipo]}
     WHERE sync_status = 'sincronizado'
       AND id NOT IN (SELECT registro_id FROM sync_outbox WHERE tipo = ?)`,
    tipo,
  );
  const sobrantes = locales.filter(fila => !enNube.has(fila.id));
  if (sobrantes.length === 0) return;
  await db.withTransactionAsync(async () => {
    for (const fila of sobrantes) {
      await db.runAsync(`DELETE FROM ${TABLAS[tipo]} WHERE id = ?`, fila.id);
    }
  });
  notificarCambioLocal(tipo);
}
