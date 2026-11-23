import { SolicitudRepository } from '../../domain/repositories/solicitudRepository';
import { solicitudService } from '../services/solicitudService';

export const solicitudRepository: SolicitudRepository = {
  obtenerTodas: () => solicitudService.obtenerTodas(),
  refrescar: () => solicitudService.refrescar(),
};
