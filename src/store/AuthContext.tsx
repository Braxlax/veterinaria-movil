import { createContext, useContext, useState, type ReactNode } from 'react';
import type { RolUsuario } from '../utils/auth';

type UsuarioAutenticado = { usuario: string; rol: RolUsuario };
type AuthContextType = {
  autenticado: boolean;
  usuarioActual: UsuarioAutenticado | null;
  iniciarSesion: (usuario: UsuarioAutenticado) => void;
  cerrarSesion: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuarioActual, setUsuarioActual] = useState<UsuarioAutenticado | null>(null);
  const iniciarSesion = (usuario: UsuarioAutenticado) => setUsuarioActual(usuario);
  const cerrarSesion = () => setUsuarioActual(null);

  return (
    <AuthContext.Provider value={{ autenticado: usuarioActual !== null, usuarioActual, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  return context;
}
