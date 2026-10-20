/**
 * Modelo de datos de la clínica veterinaria.
 * Los valores de los estados/prioridades se definen UNA sola vez aquí
 * y el resto de la app los reutiliza (evita errores de tipeo como 'pendiente' vs 'PENDIENTE').
 */
export const ESTADOS = ['PENDIENTE', 'EN_ATENCION', 'FINALIZADO'] as const;
export const PRIORIDADES = ['BAJA', 'MEDIA', 'ALTA'] as const;
export const TIPOS_SERVICIO = ['CONSULTA', 'VACUNACION', 'EMERGENCIA', 'GROOMING'] as const;

export type EstadoSolicitud = (typeof ESTADOS)[number];
export type Prioridad = (typeof PRIORIDADES)[number];
export type TipoServicio = (typeof TIPOS_SERVICIO)[number];

export interface Solicitud {
  id: string;
  clienteNombre: string;
  telefono: string;
  mascotaNombre: string;
  tipoServicio: TipoServicio;
  prioridad: Prioridad;
  descripcion: string;
  estado: EstadoSolicitud;
  /** Fecha y hora de registro en formato ISO 8601 */
  fechaRegistro: string;
}

/** Datos que el usuario escribe al crear una solicitud */
export type NuevaSolicitud = Omit<Solicitud, 'id' | 'fechaRegistro' | 'estado'>;

/** Campos que se pueden modificar desde la pantalla de detalle */
export type CambiosSolicitud = Pick<Solicitud, 'estado' | 'prioridad' | 'descripcion'>;
