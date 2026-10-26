import { Cita } from '../models/cita';
import { Prioridad, Solicitud } from '../models/solicitud';

const PESO_PRIORIDAD: Record<Prioridad, number> = { ALTA: 0, MEDIA: 1, BAJA: 2 };

export const ordenarSolicitudes = (lista: Solicitud[]): Solicitud[] =>
  [...lista].sort((a, b) => {
    const finA = a.estado === 'FINALIZADO' ? 1 : 0;
    const finB = b.estado === 'FINALIZADO' ? 1 : 0;
    if (finA !== finB) return finA - finB;
    if (a.prioridad !== b.prioridad) return PESO_PRIORIDAD[a.prioridad] - PESO_PRIORIDAD[b.prioridad];
    return new Date(b.fechaRegistro).getTime() - new Date(a.fechaRegistro).getTime();
  });

export const ordenarCitas = (lista: Cita[]): Cita[] =>
  [...lista].sort((a, b) => new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime());
