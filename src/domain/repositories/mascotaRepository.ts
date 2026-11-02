import { Mascota } from '../entities/mascota';

export interface MascotaRepository {
  obtenerTodas(): Promise<Mascota[]>;
}
