import { Sesion } from '../models/usuario';

export interface AuthState {
  sesion: Sesion | null;
}

export type AuthAction = { type: 'LOGIN'; payload: Sesion } | { type: 'LOGOUT' };

export const authInitialState: AuthState = { sesion: null };

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN':
      return { sesion: action.payload };
    case 'LOGOUT':
      return { sesion: null };
    default:
      return state;
  }
}
