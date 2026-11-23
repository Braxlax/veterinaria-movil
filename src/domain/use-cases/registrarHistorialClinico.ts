import { ConsultaClinica, Vacuna } from '../entities/mascota';
import { generarId } from '../utils/id';

export const crearVacuna = (nombre: string, proxima?: string): Vacuna => ({
  id: generarId(),
  nombre: nombre.trim(),
  fecha: new Date().toISOString(),
  proxima,
});

export const crearConsulta = (motivo: string, diagnostico: string, tratamiento: string): ConsultaClinica => ({
  id: generarId(),
  fecha: new Date().toISOString(),
  motivo: motivo.trim(),
  diagnostico: diagnostico.trim(),
  tratamiento: tratamiento.trim(),
});
