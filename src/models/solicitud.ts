
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

  fechaRegistro: string;

  mascotaId?: string;

  creadoPor?: string;
}

export type NuevaSolicitud = Omit<Solicitud, 'id' | 'fechaRegistro' | 'estado'>;

export type CambiosSolicitud = Pick<Solicitud, 'estado' | 'prioridad' | 'descripcion'>;
