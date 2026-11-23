import { createContext, useCallback, useContext, useMemo, useReducer, type ReactNode } from 'react';
import { authRepository } from '../../infraestructure/repositories/authRepository';
import { DatosRegistro, Sesion } from '../../domain/entities/usuario';
import { authInitialState, authReducer } from './authReducer';

type Resultado = { ok: true } | { ok: false; mensaje: string };

interface AuthContextType {
  sesion: Sesion | null;
  autenticado: boolean;
  iniciarSesion: (usuario: string, contrasena: string) => Promise<Resultado>;
  registrarCuenta: (datos: DatosRegistro) => Promise<Resultado>;
  cerrarSesion: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  const iniciarSesion = useCallback(async (usuario: string, contrasena: string): Promise<Resultado> => {
    const sesion = await authRepository.autenticar(usuario, contrasena);
    if (!sesion) return { ok: false, mensaje: 'Usuario o contraseña incorrectos.' };
    dispatch({ type: 'LOGIN', payload: sesion });
    return { ok: true };
  }, []);

  const registrarCuenta = useCallback((datos: DatosRegistro) => authRepository.registrar(datos), []);
  const cerrarSesion = useCallback(() => dispatch({ type: 'LOGOUT' }), []);

  const value = useMemo(
    () => ({ sesion: state.sesion, autenticado: state.sesion !== null, iniciarSesion, registrarCuenta, cerrarSesion }),
    [state.sesion, iniciarSesion, registrarCuenta, cerrarSesion]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  return context;
}
