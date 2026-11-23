import { Cita } from '../../domain/entities/cita';
import { eliminarRegistro, guardarRegistro, obtenerRegistros } from '../database/database';
import { revisarConexionYSincronizar } from '../sync/networkService';
import { firebaseConfigurado, obtenerAuth } from '../firebase/config';

export const citaService = {
  async obtenerTodas(): Promise<Cita[]> {
    return obtenerRegistros<Cita>('citas');
  },
  async guardar(cita: Cita): Promise<void> {
    await guardarRegistro('citas', cita, firebaseConfigurado ? obtenerAuth()?.currentUser?.uid : null);
    void revisarConexionYSincronizar();
  },
  async eliminar(id: string): Promise<void> {
    await eliminarRegistro('citas', id, firebaseConfigurado ? obtenerAuth()?.currentUser?.uid : null);
    void revisarConexionYSincronizar();
  },
};
