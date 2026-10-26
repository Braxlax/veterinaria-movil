import { Mascota } from '../models/mascota';
import { enDias, haceDias } from '../utils/fechas';

export const MASCOTAS_INICIALES: Mascota[] = [
  {
    id: 'm1', nombre: 'Luna', especie: 'PERRO', raza: 'Schnauzer', edadAnios: 4, pesoKg: 8.5,
    duenoNombre: 'María López', duenoTelefono: '987654321', alergias: 'Ninguna conocida',
    vacunas: [{ id: 'v1', nombre: 'Quíntuple', fecha: haceDias(400), proxima: haceDias(35) }],
    historial: [],
  },
  {
    id: 'm2', nombre: 'Max', especie: 'PERRO', raza: 'Labrador', edadAnios: 6, pesoKg: 28,
    duenoNombre: 'Carlos Ramírez', duenoTelefono: '945123678', alergias: 'Alergia al pollo',
    vacunas: [{ id: 'v2', nombre: 'Antirrábica', fecha: haceDias(340), proxima: enDias(25) }],
    historial: [
      { id: 'h1', fecha: haceDias(5), motivo: 'Control anual', diagnostico: 'Saludable, leve sobrepeso', tratamiento: 'Dieta balanceada y desparasitación' },
    ],
  },
  {
    id: 'm3', nombre: 'Michi', especie: 'GATO', raza: 'Mestizo de pelo largo', edadAnios: 3, pesoKg: 4.2,
    duenoNombre: 'Ana Torres', duenoTelefono: '912345987', duenoUsuario: 'usuario', alergias: 'Ninguna conocida',
    vacunas: [{ id: 'v3', nombre: 'Triple felina', fecha: haceDias(100), proxima: enDias(265) }],
    historial: [
      { id: 'h2', fecha: haceDias(60), motivo: 'Estornudos frecuentes', diagnostico: 'Rinitis leve', tratamiento: 'Antibiótico por 7 días' },
    ],
  },
  {
    id: 'm4', nombre: 'Rocky', especie: 'PERRO', raza: 'Bulldog francés', edadAnios: 5, pesoKg: 12,
    duenoNombre: 'Jorge Quispe', duenoTelefono: '987111222', alergias: 'Sensible a pulgas',
    vacunas: [], historial: [],
  },
  {
    id: 'm5', nombre: 'Coco', especie: 'AVE', raza: 'Agapornis', edadAnios: 2, pesoKg: 0.05,
    duenoNombre: 'Ana Torres', duenoTelefono: '912345987', duenoUsuario: 'usuario', alergias: 'Ninguna conocida',
    vacunas: [], historial: [],
  },
];
