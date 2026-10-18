import { CambiosSolicitud, Solicitud } from '../models/solicitud';

export interface SolicitudState {
  solicitudes: Solicitud[];
  cargando: boolean;
}

export type SolicitudAction =
  | { type: 'CARGANDO' }
  | { type: 'CARGAR_OK'; payload: Solicitud[] }
  | { type: 'AGREGAR'; payload: Solicitud }
  | { type: 'ACTUALIZAR'; payload: { id: string; cambios: CambiosSolicitud } }
  | { type: 'ELIMINAR'; payload: string };

export const initialState: SolicitudState = { solicitudes: [], cargando: true };

export function solicitudReducer(state: SolicitudState, action: SolicitudAction): SolicitudState {
  switch (action.type) {
    case 'CARGANDO':
      return { ...state, cargando: true };
    case 'CARGAR_OK':
      return { solicitudes: action.payload, cargando: false };
    case 'AGREGAR':
      return { ...state, solicitudes: [action.payload, ...state.solicitudes] };
    case 'ACTUALIZAR':
      return {
        ...state,
        solicitudes: state.solicitudes.map((s) =>
          s.id === action.payload.id ? { ...s, ...action.payload.cambios } : s
        ),
      };
    case 'ELIMINAR':
      return { ...state, solicitudes: state.solicitudes.filter((s) => s.id !== action.payload) };
    default:
      return state;
  }
}
