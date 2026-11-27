import * as Network from 'expo-network';
import { sincronizarPendientes } from './syncService';

export async function revisarConexionYSincronizar() {
  const estado = await Network.getNetworkStateAsync();
  if (estado.isConnected !== false) {
    return sincronizarPendientes();
  }
  return { enviados: 0, pendientes: undefined as number | undefined };
}

export function observarConexion(onCambio?: (conectado: boolean) => void) {
  return Network.addNetworkStateListener((estado) => {
    const conectado = estado.isConnected !== false;
    onCambio?.(conectado);
    if (conectado) void sincronizarPendientes();
  });
}
