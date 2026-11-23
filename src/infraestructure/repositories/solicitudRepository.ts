import { SolicitudRepository } from '../../domain/repositories/solicitudRepository';
import { solicitudService } from '../services/solicitudService';

export const solicitudRepository: SolicitudRepository = {
  obtenerTodas: () => solicitudService.obtenerTodas(),
  guardar: (solicitud) => solicitudService.guardar(solicitud),
  eliminar: (id) => solicitudService.eliminar(id),
  refrescar: () => solicitudService.refrescar(),
};
