export const ESPECIES = ['PERRO', 'GATO', 'AVE', 'OTRO'] as const;
export type Especie = (typeof ESPECIES)[number];

export interface Vacuna {
  id: string;
  nombre: string;

  fecha: string;

  proxima?: string;
}

export interface ConsultaClinica {
  id: string;
  fecha: string;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
}

export interface Mascota {
  id: string;
  nombre: string;
  especie: Especie;
  raza: string;
  edadAnios: number;
  pesoKg: number;
  duenoNombre: string;
  duenoTelefono: string;

  duenoUsuario?: string;
  alergias: string;
  vacunas: Vacuna[];
  historial: ConsultaClinica[];
}

export type NuevaMascota = Omit<Mascota, 'id' | 'vacunas' | 'historial'>;
export type CambiosMascota = Partial<NuevaMascota>;
