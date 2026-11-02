import { MASCOTAS_INICIALES } from '../data/mascotas';

const esperar = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const mascotaService = {
  async obtenerTodas() {
    await esperar(500);
    return MASCOTAS_INICIALES.map((m) => ({ ...m, vacunas: [...m.vacunas], historial: [...m.historial] }));
  },
};
