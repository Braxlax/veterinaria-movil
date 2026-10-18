import { NuevaSolicitud, Solicitud } from '../models/solicitud';

/**
 * Capa de "servicios/datos". No hay base de datos: se simula una API
 * con datos en memoria y retardos, para poder usar useEffect + estado de carga.
 */
const esperar = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const hace = (minutos: number) => new Date(Date.now() - minutos * 60_000).toISOString();

const DATOS_INICIALES: Solicitud[] = [
  {
    id: '1',
    clienteNombre: 'María López',
    telefono: '987654321',
    mascotaNombre: 'Luna',
    tipoServicio: 'EMERGENCIA',
    prioridad: 'ALTA',
    descripcion: 'Fiebre alta y decaimiento desde ayer, no quiere comer.',
    estado: 'PENDIENTE',
    fechaRegistro: hace(25),
  },
  {
    id: '2',
    clienteNombre: 'Carlos Ramírez',
    telefono: '945123678',
    mascotaNombre: 'Max',
    tipoServicio: 'VACUNACION',
    prioridad: 'MEDIA',
    descripcion: 'Refuerzo de vacuna antirrábica y desparasitación.',
    estado: 'EN_ATENCION',
    fechaRegistro: hace(120),
  },
  {
    id: '3',
    clienteNombre: 'Ana Torres',
    telefono: '912345987',
    mascotaNombre: 'Michi',
    tipoServicio: 'GROOMING',
    prioridad: 'BAJA',
    descripcion: 'Baño y corte de uñas. Pelaje largo.',
    estado: 'FINALIZADO',
    fechaRegistro: hace(1440),
  },
  {
    id: '4',
    clienteNombre: 'Jorge Quispe',
    telefono: '987111222',
    mascotaNombre: 'Rocky',
    tipoServicio: 'CONSULTA',
    prioridad: 'MEDIA',
    descripcion: 'Cojea de la pata trasera derecha desde hace dos días.',
    estado: 'PENDIENTE',
    fechaRegistro: hace(300),
  },
];

export const solicitudService = {
  /** Simula la carga inicial desde un servidor. */
  async obtenerTodas(): Promise<Solicitud[]> {
    await esperar(700);
    return DATOS_INICIALES.map((s) => ({ ...s }));
  },

  /** Simula "pull to refresh". */
  async refrescar(): Promise<void> {
    await esperar(800);
  },

  /** Construye una solicitud completa (id, estado y fecha los asigna el sistema). */
  crear(datos: NuevaSolicitud): Solicitud {
    return {
      ...datos,
      clienteNombre: datos.clienteNombre.trim(),
      mascotaNombre: datos.mascotaNombre.trim(),
      telefono: datos.telefono.trim(),
      descripcion: datos.descripcion.trim(),
      id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      estado: 'PENDIENTE',
      fechaRegistro: new Date().toISOString(),
    };
  },
};
