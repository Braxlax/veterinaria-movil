import { TipoServicio } from './solicitud';

export const ESTADOS_CITA = ['PROGRAMADA', 'COMPLETADA', 'CANCELADA'] as const;
export type EstadoCita = (typeof ESTADOS_CITA)[number];

export interface Cita {
  id: string;
  mascotaId: string;
  mascotaNombre: string;
  duenoUsuario?: string;
  tipoServicio: TipoServicio;

  fechaHora: string;
  veterinario: string;
  motivo: string;
  estado: EstadoCita;
  creadoPor: string;
}

export type NuevaCita = Omit<Cita, 'id' | 'estado'>;
