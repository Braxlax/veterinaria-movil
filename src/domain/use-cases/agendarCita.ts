import { Cita, NuevaCita } from '../entities/cita';
import { generarId } from '../utils/id';

export const crearCita = (datos: NuevaCita): Cita => ({
  ...datos,
  motivo: datos.motivo.trim(),
  id: generarId(),
  estado: 'PROGRAMADA',
});

export const verificarHorarioOcupado = (citas: Cita[], veterinario: string, fechaHora: string): boolean => {
  const t = new Date(fechaHora).getTime();
  return citas.some(
    (c) => c.estado === 'PROGRAMADA' && c.veterinario === veterinario && new Date(c.fechaHora).getTime() === t
  );
};
