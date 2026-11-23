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

export async function sincronizarPendientes(): Promise<{ enviados: number; pendientes: number }> {
  if (sincronizacionEnCurso) {
    return { enviados: 0, pendientes: await contarPendientesSincronizacion(obtenerAuth()?.currentUser?.uid) };
  }
  if (!firebaseConfigurado || !obtenerAuth()?.currentUser) {
    return { enviados: 0, pendientes: await contarPendientesSincronizacion(obtenerAuth()?.currentUser?.uid) };
  }
  const red = await Network.getNetworkStateAsync();
  if (!red.isConnected || red.isInternetReachable === false) {
    return { enviados: 0, pendientes: await contarPendientesSincronizacion(obtenerAuth()?.currentUser?.uid) };
  }

  sincronizacionEnCurso = true;
  let enviados = 0;
  try {
    const uid = obtenerAuth()?.currentUser?.uid;
    if (!uid) return { enviados: 0, pendientes: await contarPendientesSincronizacion() };
    const pendientes = await obtenerPendientesSincronizacion(uid);
    for (const pendiente of pendientes) {
      try {
        await sincronizarOperacionFirebase(pendiente);
        await marcarSincronizado(pendiente);
        enviados += 1;
      } catch (error) {
        console.warn('[Sincronización] No se pudo enviar el registro:', pendiente.registroId, error);
        break;
      }
    }
    // Después de enviar la cola local, recupera los cambios remotos del usuario.
    for (const tipo of TIPOS) {
      try {
        await descargarDatosFirebase(tipo);
      } catch (error) {
        console.warn(`[Sincronización] No se pudieron descargar ${tipo}:`, error);
      }
    }
  } finally {
    sincronizacionEnCurso = false;
  }
  return { enviados, pendientes: await contarPendientesSincronizacion(obtenerAuth()?.currentUser?.uid) };
}

export async function obtenerEstadoSincronizacion() {
  const uid = obtenerAuth()?.currentUser?.uid;
  return { firebaseConfigurado, pendientes: await contarPendientesSincronizacion(uid) };
}
