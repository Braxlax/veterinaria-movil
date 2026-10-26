import { Cita } from '../models/cita';
import { enDias } from '../utils/fechas';

export const CITAS_INICIALES: Cita[] = [
  { id: 'c1', mascotaId: 'm2', mascotaNombre: 'Max', tipoServicio: 'VACUNACION', fechaHora: enDias(0, 11), veterinario: 'Dr. Marco Vidal', motivo: 'Refuerzo antirrábico', estado: 'PROGRAMADA', creadoPor: 'admin' },
  { id: 'c2', mascotaId: 'm1', mascotaNombre: 'Luna', tipoServicio: 'CONSULTA', fechaHora: enDias(0, 15), veterinario: 'Dra. Elena Salazar', motivo: 'Control por fiebre', estado: 'PROGRAMADA', creadoPor: 'admin' },
  { id: 'c3', mascotaId: 'm3', mascotaNombre: 'Michi', duenoUsuario: 'usuario', tipoServicio: 'GROOMING', fechaHora: enDias(1, 10), veterinario: 'Dra. Lucía Paredes', motivo: 'Baño y corte de pelo', estado: 'PROGRAMADA', creadoPor: 'usuario' },
  { id: 'c4', mascotaId: 'm4', mascotaNombre: 'Rocky', tipoServicio: 'CONSULTA', fechaHora: enDias(2, 16), veterinario: 'Dr. Marco Vidal', motivo: 'Revisión de cojera', estado: 'PROGRAMADA', creadoPor: 'admin' },
  { id: 'c5', mascotaId: 'm5', mascotaNombre: 'Coco', duenoUsuario: 'usuario', tipoServicio: 'CONSULTA', fechaHora: enDias(3, 9), veterinario: 'Dra. Elena Salazar', motivo: 'Revisión general del ave', estado: 'PROGRAMADA', creadoPor: 'usuario' },
  { id: 'c6', mascotaId: 'm2', mascotaNombre: 'Max', tipoServicio: 'CONSULTA', fechaHora: enDias(-5, 10), veterinario: 'Dr. Marco Vidal', motivo: 'Control anual', estado: 'COMPLETADA', creadoPor: 'admin' },
];
