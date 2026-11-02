import { Cita } from '../entities/cita';

export interface CitaRepository {
  obtenerTodas(): Promise<Cita[]>;
}
