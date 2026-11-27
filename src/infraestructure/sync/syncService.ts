import * as Network from 'expo-network';

import {
  contarPendientesSincronizacion,
  marcarSincronizado,
  obtenerPendientesSincronizacion,
  type TipoRegistroLocal,
} from '../database/database';

import { firebaseConfigurado, obtenerAuth } from '../firebase/config';

import { descargarDatosFirebase, sincronizarOperacionFirebase } from '../firebase/firestoreService';

let sincronizacionEnCurso = false;

const TIPOS: TipoRegistroLocal[] = ['mascotas', 'citas', 'solicitudes'];

export async function sincronizarPendientes(): Promise<{
  enviados: number;
  pendientes: number;
}> {
  // Evitar dos sincronizaciones simultáneas.
  if (sincronizacionEnCurso) {
    console.log('[SYNC] Ya existe una sincronización en curso.');

    return {
      enviados: 0,
      pendientes: await contarPendientesSincronizacion(obtenerAuth()?.currentUser?.uid),
    };
  }

  // Comprobar configuración de Firebase.
  if (!firebaseConfigurado) {
    console.warn('[SYNC] Firebase no está configurado.');

    return {
      enviados: 0,
      pendientes: await contarPendientesSincronizacion(),
    };
  }

  // Comprobar sesión.
  const auth = obtenerAuth();
  const usuario = auth?.currentUser;

  if (!usuario) {
    console.log('[SYNC] No existe un usuario autenticado.');

    return {
      enviados: 0,
      pendientes: await contarPendientesSincronizacion(),
    };
  }

  console.log('[SYNC] Usuario autenticado:', usuario.uid);

  // Comprobar conexión a Internet.
  const red = await Network.getNetworkStateAsync();

  console.log('[SYNC] Estado de red:', {
    conectado: red.isConnected,
    internetDisponible: red.isInternetReachable,
  });

  // Android may report an active network as not validated in the emulator.
  // Let Firebase verify reachability instead of blocking the sync here.
  if (red.isConnected === false) {
    console.warn('[SYNC] No hay conexión a Internet.');

    return {
      enviados: 0,
      pendientes: await contarPendientesSincronizacion(usuario.uid),
    };
  }

  sincronizacionEnCurso = true;

  let enviados = 0;

  try {
    const uid = usuario.uid;

    // 1. Obtener operaciones pendientes.
    const pendientesLocales = await obtenerPendientesSincronizacion(uid);

    console.log('[SYNC] Operaciones pendientes:', pendientesLocales.length);

    // 2. Enviar operaciones locales a Firebase.
    for (const pendiente of pendientesLocales) {
      try {
        console.log('[SYNC] Enviando registro:', pendiente.registroId, pendiente.tipo);

        await sincronizarOperacionFirebase(pendiente);

        await marcarSincronizado(pendiente);

        enviados++;

        console.log('[SYNC] Registro sincronizado:', pendiente.registroId);
      } catch (error) {
        console.error('[SYNC] Error enviando registro:', pendiente.registroId, error);

        break;
      }
    }

    // 3. Descargar datos de Firestore a SQLite.
    for (const tipo of TIPOS) {
      console.log(`[SYNC] Iniciando descarga: ${tipo}`);

      try {
        await descargarDatosFirebase(tipo);

        console.log(`[SYNC] Descarga completada correctamente: ${tipo}`);
      } catch (error) {
        console.error(`[SYNC] Error descargando ${tipo}:`, error);
      }
    }

    console.log('[SYNC] Proceso de sincronización finalizado.');
  } catch (error) {
    console.error('[SYNC] Error general:', error);
  } finally {
    sincronizacionEnCurso = false;
  }

  // 4. Consultar operaciones pendientes restantes.
  const pendientesRestantes = await contarPendientesSincronizacion(usuario.uid);

  console.log('[SYNC] Resultado:', {
    enviados,
    pendientes: pendientesRestantes,
  });

  return {
    enviados,
    pendientes: pendientesRestantes,
  };
}

// Consultar el estado de sincronización.
export async function obtenerEstadoSincronizacion() {
  const uid = obtenerAuth()?.currentUser?.uid;

  const pendientes = await contarPendientesSincronizacion(uid);

  return {
    firebaseConfigurado,
    pendientes,
  };
}
