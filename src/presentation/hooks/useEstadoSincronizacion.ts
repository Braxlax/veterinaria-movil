import * as Network from 'expo-network';
import { useEffect, useState } from 'react';
import { escucharCambiosLocales } from '../../infraestructure/database/databaseEvents';
import { obtenerEstadoSincronizacion } from '../../infraestructure/sync/syncService';

const hayInternet = (estado: Network.NetworkState) => Boolean(estado.isConnected && estado.isInternetReachable !== false);

/**
 * Devuelve el estado de la conexión y cuántos cambios están esperando
 * ser enviados a Firebase (cola local de SQLite).
 */
export function useEstadoSincronizacion() {
  const [conectado, setConectado] = useState(true);
  const [pendientes, setPendientes] = useState(0);
  const [usaNube, setUsaNube] = useState(false);

  useEffect(() => {
    let activo = true;

    const refrescarPendientes = async () => {
      try {
        const estado = await obtenerEstadoSincronizacion();
        if (!activo) return;
        setPendientes(estado.pendientes);
        setUsaNube(estado.firebaseConfigurado);
      } catch {
        // Si falla la lectura local, simplemente conservamos el último valor.
      }
    };

    Network.getNetworkStateAsync()
      .then(estado => {
        if (activo) setConectado(hayInternet(estado));
      })
      .catch(() => {});

    const suscripcionRed = Network.addNetworkStateListener(estado => {
      setConectado(hayInternet(estado));
      void refrescarPendientes();
    });
    const quitarEscuchaLocal = escucharCambiosLocales(() => void refrescarPendientes());
    const intervalo = setInterval(refrescarPendientes, 4000);
    void refrescarPendientes();

    return () => {
      activo = false;
      suscripcionRed.remove();
      quitarEscuchaLocal();
      clearInterval(intervalo);
    };
  }, []);

  return { conectado, pendientes, usaNube };
}
