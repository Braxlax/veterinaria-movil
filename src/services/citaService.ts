import { CITAS_INICIALES } from '../data/citas';
import { Cita, NuevaCita } from '../models/cita';
import { generarId } from '../utils/id';

const esperar = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const citaService = {
  async obtenerTodas(): Promise<Cita[]> {
    await esperar(500);
    return CITAS_INICIALES.map((c) => ({ ...c }));
  },

  crear(datos: NuevaCita): Cita {
    return { ...datos, motivo: datos.motivo.trim(), id: generarId(), estado: 'PROGRAMADA' };
  },

  horarioOcupado(citas: Cita[], veterinario: string, fechaHora: string): boolean {
    const t = new Date(fechaHora).getTime();
    return citas.some(
      (c) => c.estado === 'PROGRAMADA' && c.veterinario === veterinario && new Date(c.fechaHora).getTime() === t
    );
  },
};
