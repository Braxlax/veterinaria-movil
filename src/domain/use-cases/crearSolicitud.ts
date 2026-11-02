import { NuevaSolicitud, Solicitud } from '../entities/solicitud';
import { generarId } from '../utils/id';

export const crearSolicitud = (datos: NuevaSolicitud): Solicitud => ({
  ...datos,
  clienteNombre: datos.clienteNombre.trim(),
  mascotaNombre: datos.mascotaNombre.trim(),
  telefono: datos.telefono.trim(),
  descripcion: datos.descripcion.trim(),
  id: generarId(),
  estado: 'PENDIENTE',
  fechaRegistro: new Date().toISOString(),
});
