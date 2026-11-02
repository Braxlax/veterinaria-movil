import { Solicitud } from '../entities/solicitud';

export interface SolicitudRepository {
  obtenerTodas(): Promise<Solicitud[]>;
  refrescar(): Promise<void>;
}
