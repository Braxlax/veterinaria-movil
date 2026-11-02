import { CITAS_INICIALES } from '../data/citas';

const esperar = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const citaService = {
  async obtenerTodas() {
    await esperar(500);
    return CITAS_INICIALES.map((c) => ({ ...c }));
  },
};
