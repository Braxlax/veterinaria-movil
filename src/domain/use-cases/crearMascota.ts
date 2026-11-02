import { Mascota, NuevaMascota } from '../entities/mascota';
import { generarId } from '../utils/id';

export const crearMascota = (datos: NuevaMascota): Mascota => ({
  ...datos,
  nombre: datos.nombre.trim(),
  raza: datos.raza.trim(),
  duenoNombre: datos.duenoNombre.trim(),
  duenoTelefono: datos.duenoTelefono.trim(),
  alergias: datos.alergias.trim() || 'Ninguna conocida',
  id: generarId(),
  vacunas: [],
  historial: [],
});
