import { useAuth } from '../store/AuthContext';
import { Permisos, permisosDe } from '../../domain/rules/permisos';

export function usePermisos(): Permisos & { rol: string; usuario: string } {
  const { sesion } = useAuth();
  const rol = sesion?.rol ?? 'cliente';
  return { ...permisosDe(rol), rol, usuario: sesion?.usuario ?? '' };
}
