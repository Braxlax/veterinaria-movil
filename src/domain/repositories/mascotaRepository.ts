import { Mascota } from '../entities/mascota';

export interface MascotaRepository {
  obtenerTodas(): Promise<Mascota[]>;
  guardar(mascota: Mascota): Promise<void>;
  eliminar(id: string): Promise<void>;
}
