import { EstadoCita } from '../../domain/entities/cita';
import { Especie } from '../../domain/entities/mascota';
import { EstadoSolicitud, Prioridad, TipoServicio } from '../../domain/entities/solicitud';
import { RolUsuario } from '../../domain/entities/usuario';
import { colors } from '../theme/theme';

export type IconName =
  | 'stethoscope'
  | 'needle'
  | 'ambulance'
  | 'content-cut'
  | 'dog'
  | 'cat'
  | 'bird'
  | 'paw'
  | 'rabbit'
  | 'home-variant'
  | 'clipboard-text'
  | 'calendar-month'
  | 'account-circle'
  | 'magnify'
  | 'close'
  | 'delete-outline'
  | 'plus'
  | 'phone'
  | 'logout'
  | 'alert-circle'
  | 'check-circle'
  | 'pencil'
  | 'eye'
  | 'eye-off'
  | 'wifi-off'
  | 'cloud-sync-outline'
  | 'account'
  | 'clock-outline'
  | 'shield-crown'
  | 'desk'
  | 'account-heart'
  | 'tag'
  | 'cash'
  | 'timer-outline'
  | 'email'
  | 'information'
  | 'heart-pulse'
  | 'calendar-plus'
  | 'file-document-outline'
  | 'scale-bathroom'
  | 'cake-variant'
  | 'medical-bag'
  | 'chevron-right'
  | 'arrow-left'
  | 'cancel'
  | 'check'
  | 'lock'
  | 'account-plus'
  | 'bell-ring'
  | 'wifi-off'
  | 'refresh'
  | 'image';

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

export const ROL_INFO: Record<
  RolUsuario,
  {
    label: string;
    icon: 'shield-crown' | 'account-heart';
    descripcion: string;
  }
> = {
  admin: {
    label: 'Administrador',
    icon: 'shield-crown',
    descripcion: 'Gestiona toda la clínica',
  },
  cliente: {
    label: 'Cliente',
    icon: 'account-heart',
    descripcion: 'Consulta sus mascotas y citas',
  },
};
