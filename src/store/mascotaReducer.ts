import { CambiosMascota, ConsultaClinica, Mascota, Vacuna } from '../models/mascota';

export interface MascotaState {
  mascotas: Mascota[];
  cargando: boolean;
}

export type MascotaAction =
  | { type: 'CARGANDO' }
  | { type: 'CARGAR_OK'; payload: Mascota[] }
  | { type: 'AGREGAR'; payload: Mascota }
  | { type: 'ACTUALIZAR'; payload: { id: string; cambios: CambiosMascota } }
  | { type: 'ELIMINAR'; payload: string }
  | { type: 'AGREGAR_VACUNA'; payload: { id: string; vacuna: Vacuna } }
  | { type: 'AGREGAR_CONSULTA'; payload: { id: string; consulta: ConsultaClinica } };

export const mascotaInitialState: MascotaState = { mascotas: [], cargando: true };

const actualizar = (lista: Mascota[], id: string, fn: (m: Mascota) => Mascota) =>
  lista.map((m) => (m.id === id ? fn(m) : m));

export function mascotaReducer(state: MascotaState, action: MascotaAction): MascotaState {
  switch (action.type) {
    case 'CARGANDO':
      return { ...state, cargando: true };
    case 'CARGAR_OK':
      return { mascotas: action.payload, cargando: false };
    case 'AGREGAR':
      return { ...state, mascotas: [action.payload, ...state.mascotas] };
    case 'ACTUALIZAR':
      return { ...state, mascotas: actualizar(state.mascotas, action.payload.id, (m) => ({ ...m, ...action.payload.cambios })) };
    case 'ELIMINAR':
      return { ...state, mascotas: state.mascotas.filter((m) => m.id !== action.payload) };
    case 'AGREGAR_VACUNA':
      return {
        ...state,
        mascotas: actualizar(state.mascotas, action.payload.id, (m) => ({ ...m, vacunas: [action.payload.vacuna, ...m.vacunas] })),
      };
    case 'AGREGAR_CONSULTA':
      return {
        ...state,
        mascotas: actualizar(state.mascotas, action.payload.id, (m) => ({ ...m, historial: [action.payload.consulta, ...m.historial] })),
      };
    default:
      return state;
  }
}
