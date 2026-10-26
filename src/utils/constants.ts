import { Especie } from '../models/mascota';
import { EstadoCita } from '../models/cita';
import { EstadoSolicitud, Prioridad, TipoServicio } from '../models/solicitud';
import { colors } from './theme';

export type IconName =
  | 'stethoscope' | 'needle' | 'ambulance' | 'content-cut' | 'dog' | 'cat' | 'bird' | 'paw' | 'rabbit'
  | 'home-variant' | 'clipboard-text' | 'calendar-month' | 'account-circle' | 'magnify' | 'close' | 'delete-outline'
  | 'plus' | 'phone' | 'whatsapp' | 'map-marker' | 'logout' | 'alert-circle' | 'check-circle' | 'pencil'
  | 'eye' | 'eye-off' | 'account' | 'clock-outline' | 'shield-crown' | 'desk' | 'account-heart' | 'tag'
  | 'cash' | 'timer-outline' | 'email' | 'information' | 'heart-pulse' | 'calendar-plus' | 'file-document-outline'
  | 'scale-bathroom' | 'cake-variant' | 'medical-bag' | 'chevron-right' | 'arrow-left' | 'cancel' | 'check'
  | 'lock' | 'account-plus' | 'bell-ring' | 'store-clock';

type ChipStyle = { label: string; bg: string; fg: string };

export const ESTADO_INFO: Record<EstadoSolicitud, ChipStyle> = {
  PENDIENTE: { label: 'Pendiente', bg: colors.warningSoft, fg: colors.warning },
  EN_ATENCION: { label: 'En atención', bg: colors.infoSoft, fg: colors.info },
  FINALIZADO: { label: 'Finalizado', bg: colors.successSoft, fg: colors.success },
};

export const PRIORIDAD_INFO: Record<Prioridad, ChipStyle> = {
  BAJA: { label: 'Baja', bg: colors.neutralSoft, fg: colors.neutral },
  MEDIA: { label: 'Media', bg: colors.warningSoft, fg: colors.warning },
  ALTA: { label: 'Alta', bg: colors.dangerSoft, fg: colors.danger },
};

export const ESTADO_CITA_INFO: Record<EstadoCita, ChipStyle> = {
  PROGRAMADA: { label: 'Programada', bg: colors.infoSoft, fg: colors.info },
  COMPLETADA: { label: 'Completada', bg: colors.successSoft, fg: colors.success },
  CANCELADA: { label: 'Cancelada', bg: colors.dangerSoft, fg: colors.danger },
};

export const SERVICIO_INFO: Record<TipoServicio, { label: string; icon: IconName; color: string; fg: string }> = {
  CONSULTA: { label: 'Consulta', icon: 'stethoscope', color: colors.infoSoft, fg: colors.info },
  VACUNACION: { label: 'Vacunación', icon: 'needle', color: colors.successSoft, fg: colors.success },
  EMERGENCIA: { label: 'Emergencia', icon: 'ambulance', color: colors.dangerSoft, fg: colors.danger },
  GROOMING: { label: 'Grooming', icon: 'content-cut', color: colors.violetSoft, fg: colors.violet },
};

export const ESPECIE_INFO: Record<Especie, { label: string; icon: IconName }> = {
  PERRO: { label: 'Perro', icon: 'dog' },
  GATO: { label: 'Gato', icon: 'cat' },
  AVE: { label: 'Ave', icon: 'bird' },
  OTRO: { label: 'Otro', icon: 'paw' },
};

export const CATALOGO_SERVICIOS: Record<TipoServicio, { descripcion: string; precioDesde: number; duracionMin: number }> = {
  CONSULTA: { descripcion: 'Revisión general, diagnóstico y recomendaciones de tratamiento.', precioDesde: 60, duracionMin: 30 },
  VACUNACION: { descripcion: 'Esquema de vacunas, refuerzos anuales y desparasitación.', precioDesde: 45, duracionMin: 20 },
  EMERGENCIA: { descripcion: 'Atención inmediata las 24 horas para casos críticos.', precioDesde: 120, duracionMin: 60 },
  GROOMING: { descripcion: 'Baño, corte de pelo, corte de uñas y limpieza de oídos.', precioDesde: 50, duracionMin: 90 },
};

export const CLINICA_NOMBRE = 'Centro Médico Mr. Patitas';

export const CLINICA = {
  telefono: '987654321',
  telefonoVisible: '987 654 321',
  whatsapp: '51987654321',
  direccion: 'Av. Los Patitos 123, Lima',
  correo: 'contacto@mrpatitas.pe',
  horario: [
    { dias: 'Lunes a viernes', horas: '9:00 – 19:00' },
    { dias: 'Sábados', horas: '9:00 – 14:00' },
    { dias: 'Emergencias', horas: '24 horas' },
  ],
  mapa: 'https://www.google.com/maps/search/?api=1&query=Av.+Los+Patitos+123+Lima',
};

export const VETERINARIOS = ['Dra. Elena Salazar', 'Dr. Marco Vidal', 'Dra. Lucía Paredes'];
export const HORARIOS = ['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00', '18:00'];
