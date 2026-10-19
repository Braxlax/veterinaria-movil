import { createContext, useContext, useState, type ReactNode } from 'react';

type AuthContextType = {
  autenticado: boolean;
  iniciarSesion: () => void;
  cerrarSesion: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [autenticado, setAutenticado] = useState(false);

  const iniciarSesion = () => setAutenticado(true);
  const cerrarSesion = () => setAutenticado(false);

  return <AuthContext.Provider value={{ autenticado, iniciarSesion, cerrarSesion }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe utilizarse dentro de AuthProvider');
  }

  return context;
}
