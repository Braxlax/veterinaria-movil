import { CitaRepository } from '../../domain/repositories/citaRepository';
import { citaService } from '../services/citaService';

export const citaRepository: CitaRepository = {
  obtenerTodas: () => citaService.obtenerTodas(),
};
