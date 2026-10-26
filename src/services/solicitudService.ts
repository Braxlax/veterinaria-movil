import { SOLICITUDES_INICIALES } from '../data/solicitudes';
import { NuevaSolicitud, Solicitud } from '../models/solicitud';
import { generarId } from '../utils/id';

const esperar = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const solicitudService = {
  async obtenerTodas(): Promise<Solicitud[]> {
    await esperar(700);
    return SOLICITUDES_INICIALES.map((s) => ({ ...s }));
  },

  async refrescar(): Promise<void> {
    await esperar(800);
  },

  crear(datos: NuevaSolicitud): Solicitud {
    return {
      ...datos,
      clienteNombre: datos.clienteNombre.trim(),
      mascotaNombre: datos.mascotaNombre.trim(),
      telefono: datos.telefono.trim(),
      descripcion: datos.descripcion.trim(),
      id: generarId(),
      estado: 'PENDIENTE',
      fechaRegistro: new Date().toISOString(),
    };
  },
};
