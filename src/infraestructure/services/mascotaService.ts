import { Mascota } from '../../domain/entities/mascota';
import { eliminarRegistro, guardarRegistro, obtenerRegistros } from '../database/database';
import { revisarConexionYSincronizar } from '../sync/networkService';
import { firebaseConfigurado, obtenerAuth } from '../firebase/config';

export const mascotaService = {
  async obtenerTodas(): Promise<Mascota[]> {
    // La primera apertura crea SQLite y carga los datos de ejemplo si la tabla está vacía.
    return obtenerRegistros<Mascota>('mascotas');
  },
  async guardar(mascota: Mascota): Promise<void> {
    await guardarRegistro('mascotas', mascota, firebaseConfigurado ? obtenerAuth()?.currentUser?.uid : null);
    void revisarConexionYSincronizar();
  },
  async eliminar(id: string): Promise<void> {
    await eliminarRegistro('mascotas', id, firebaseConfigurado ? obtenerAuth()?.currentUser?.uid : null);
    void revisarConexionYSincronizar();
  },
};
