import { Solicitud } from '../entities/solicitud';

export interface SolicitudRepository {
  obtenerTodas(): Promise<Solicitud[]>;
  guardar(solicitud: Solicitud): Promise<void>;
  eliminar(id: string): Promise<void>;
  refrescar(): Promise<void>;
}
