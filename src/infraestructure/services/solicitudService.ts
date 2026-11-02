import { SOLICITUDES_INICIALES } from '../data/solicitudes';

const esperar = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const solicitudService = {
  async obtenerTodas() {
    await esperar(700);
    return SOLICITUDES_INICIALES.map((s) => ({ ...s }));
  },

  async refrescar() {
    await esperar(800);
  },
};
