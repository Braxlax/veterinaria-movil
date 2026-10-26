import { MASCOTAS_INICIALES } from '../data/mascotas';
import { ConsultaClinica, Mascota, NuevaMascota, Vacuna } from '../models/mascota';
import { generarId } from '../utils/id';

const esperar = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export const mascotaService = {
  async obtenerTodas(): Promise<Mascota[]> {
    await esperar(500);
    return MASCOTAS_INICIALES.map((m) => ({ ...m, vacunas: [...m.vacunas], historial: [...m.historial] }));
  },

  crear(datos: NuevaMascota): Mascota {
    return {
      ...datos,
      nombre: datos.nombre.trim(),
      raza: datos.raza.trim(),
      duenoNombre: datos.duenoNombre.trim(),
      duenoTelefono: datos.duenoTelefono.trim(),
      alergias: datos.alergias.trim() || 'Ninguna conocida',
      id: generarId(),
      vacunas: [],
      historial: [],
    };
  },

  nuevaVacuna(nombre: string, proxima?: string): Vacuna {
    return { id: generarId(), nombre: nombre.trim(), fecha: new Date().toISOString(), proxima };
  },

  nuevaConsulta(motivo: string, diagnostico: string, tratamiento: string): ConsultaClinica {
    return {
      id: generarId(),
      fecha: new Date().toISOString(),
      motivo: motivo.trim(),
      diagnostico: diagnostico.trim(),
      tratamiento: tratamiento.trim(),
    };
  },
};
