import { MascotaRepository } from '../../domain/repositories/mascotaRepository';
import { mascotaService } from '../services/mascotaService';

export const mascotaRepository: MascotaRepository = {
  obtenerTodas: () => mascotaService.obtenerTodas(),
};
