import { Solicitud } from '../../domain/entities/solicitud';
import { eliminarRegistro, guardarRegistro, obtenerRegistros } from '../database/database';
import { revisarConexionYSincronizar } from '../sync/networkService';
import { firebaseConfigurado, obtenerAuth } from '../firebase/config';

export const solicitudService = {
  async obtenerTodas(): Promise<Solicitud[]> {
    return obtenerRegistros<Solicitud>('solicitudes');
  },
  async guardar(solicitud: Solicitud): Promise<void> {
    await guardarRegistro('solicitudes', solicitud, firebaseConfigurado ? obtenerAuth()?.currentUser?.uid : null);
    void revisarConexionYSincronizar();
  },
  async eliminar(id: string): Promise<void> {
    await eliminarRegistro('solicitudes', id, firebaseConfigurado ? obtenerAuth()?.currentUser?.uid : null);
    void revisarConexionYSincronizar();
  },
  async refrescar(): Promise<void> {
    await revisarConexionYSincronizar();
  },
};
