import { Cita } from '../entities/cita';

export interface CitaRepository {
  obtenerTodas(): Promise<Cita[]>;
  guardar(cita: Cita): Promise<void>;
  eliminar(id: string): Promise<void>;
}
