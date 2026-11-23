import { TipoServicio } from '../entities/solicitud';

export const CATALOGO_SERVICIOS: Record<TipoServicio, { descripcion: string; precioDesde: number; duracionMin: number }> = {
  CONSULTA: { descripcion: 'Revisión general, diagnóstico y recomendaciones de tratamiento.', precioDesde: 60, duracionMin: 30 },
  VACUNACION: { descripcion: 'Esquema de vacunas, refuerzos anuales y desparasitación.', precioDesde: 45, duracionMin: 20 },
  EMERGENCIA: { descripcion: 'Atención inmediata las 24 horas para casos críticos.', precioDesde: 120, duracionMin: 60 },
  GROOMING: { descripcion: 'Baño, corte de pelo, corte de uñas y limpieza de oídos.', precioDesde: 50, duracionMin: 90 },
};

export const CLINICA_NOMBRE = 'Centro Médico Mr. Patitas';

export const VETERINARIOS = ['Dra. Elena Salazar', 'Dr. Marco Vidal', 'Dra. Lucía Paredes'];
export const HORARIOS = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
