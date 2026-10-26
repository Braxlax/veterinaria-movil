import { Cita, EstadoCita } from '../models/cita';

export interface CitaState {
  citas: Cita[];
  cargando: boolean;
}

export type CitaAction =
  | { type: 'CARGANDO' }
  | { type: 'CARGAR_OK'; payload: Cita[] }
  | { type: 'AGREGAR'; payload: Cita }
  | { type: 'CAMBIAR_ESTADO'; payload: { id: string; estado: EstadoCita } }
  | { type: 'ELIMINAR_POR_MASCOTA'; payload: string };

export const citaInitialState: CitaState = { citas: [], cargando: true };

export function citaReducer(state: CitaState, action: CitaAction): CitaState {
  switch (action.type) {
    case 'CARGANDO':
      return { ...state, cargando: true };
    case 'CARGAR_OK':
      return { citas: action.payload, cargando: false };
    case 'AGREGAR':
      return { ...state, citas: [action.payload, ...state.citas] };
    case 'CAMBIAR_ESTADO':
      return {
        ...state,
        citas: state.citas.map((c) => (c.id === action.payload.id ? { ...c, estado: action.payload.estado } : c)),
      };
    case 'ELIMINAR_POR_MASCOTA':
      return { ...state, citas: state.citas.filter((c) => c.mascotaId !== action.payload) };
    default:
      return state;
  }
}
