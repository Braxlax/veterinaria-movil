import { EstadoSolicitud, Prioridad, TipoServicio } from '../models/solicitud';

type ChipStyle = { label: string; bg: string; fg: string };

export const ESTADO_INFO: Record<EstadoSolicitud, ChipStyle> = {
  PENDIENTE: { label: 'Pendiente', bg: '#FFF1D6', fg: '#9A6A00' },
  EN_ATENCION: { label: 'En atención', bg: '#DCEBFA', fg: '#1F5F9E' },
  FINALIZADO: { label: 'Finalizado', bg: '#DDF2E3', fg: '#2F7A47' },
};

export const PRIORIDAD_INFO: Record<Prioridad, ChipStyle> = {
  BAJA: { label: 'Baja', bg: '#E8EEF2', fg: '#4F6472' },
  MEDIA: { label: 'Media', bg: '#FFF1D6', fg: '#9A6A00' },
  ALTA: { label: 'Alta', bg: '#FBE0DC', fg: '#B3311F' },
};

export const SERVICIO_INFO: Record<TipoServicio, { label: string; icon: string; color: string }> = {
  CONSULTA: { label: 'Consulta', icon: '🩺', color: '#E3EEF9' },
  VACUNACION: { label: 'Vacunación', icon: '💉', color: '#E4F4E8' },
  EMERGENCIA: { label: 'Emergencia', icon: '🚑', color: '#FBE3DF' },
  GROOMING: { label: 'Grooming', icon: '✂️', color: '#F3E6F7' },
};

export const CLINICA_NOMBRE = 'Centro Médico Mr. Patitas';
