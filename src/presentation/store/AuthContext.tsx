import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { DatosRegistro, Sesion } from '../../domain/entities/usuario';
import { observarSesionFirebase } from '../../infraestructure/firebase/authFirebaseService';
import { firebaseConfigurado } from '../../infraestructure/firebase/config';
import { authRepository } from '../../infraestructure/repositories/authRepository';
import { sincronizarPendientes } from '../../infraestructure/sync/syncService';
import { authInitialState, authReducer } from './authReducer';

type Resultado = { ok: true } | { ok: false; mensaje: string };

interface AuthContextType {
  sesion: Sesion | null;
  autenticado: boolean;
  iniciarSesion: (usuario: string, contrasena: string) => Promise<Resultado>;
  registrarCuenta: (datos: DatosRegistro) => Promise<Resultado>;
  recuperarContrasena: (correo: string) => Promise<Resultado>;
  cerrarSesion: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, authInitialState);

  useEffect(() => {
    if (!firebaseConfigurado) return;
    return observarSesionFirebase(sesion => {
      if (sesion) {
        dispatch({ type: 'LOGIN', payload: sesion });
        void sincronizarPendientes();
      } else dispatch({ type: 'LOGOUT' });
    });
  }, []);

  const iniciarSesion = useCallback(async (usuario: string, contrasena: string): Promise<Resultado> => {
    try {
      const sesion = await authRepository.autenticar(usuario, contrasena);
      if (!sesion) return { ok: false, mensaje: 'Usuario o contraseña incorrectos.' };
      dispatch({ type: 'LOGIN', payload: sesion });
      void sincronizarPendientes();
      return { ok: true };
    } catch (error) {
      return { ok: false, mensaje: error instanceof Error ? error.message : 'No se pudo iniciar sesión.' };
    }
  }, []);

  const registrarCuenta = useCallback((datos: DatosRegistro) => authRepository.registrar(datos), []);
  const recuperarContrasena = useCallback((correo: string) => authRepository.recuperarContrasena(correo), []);
  const cerrarSesion = useCallback(async () => {
    try {
      await authRepository.cerrarSesion();
    } finally {
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const value = useMemo(
    () => ({ sesion: state.sesion, autenticado: state.sesion !== null, iniciarSesion, registrarCuenta, recuperarContrasena, cerrarSesion }),
    [state.sesion, iniciarSesion, registrarCuenta, recuperarContrasena, cerrarSesion],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  return context;
}
