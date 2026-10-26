import { useMemo } from 'react';
import { useAuth } from '../store/AuthContext';
import { useCitas } from '../store/CitaContext';
import { useMascotas } from '../store/MascotaContext';
import { useSolicitudes } from '../store/SolicitudContext';
import { permisosDe } from '../utils/permisos';

export function useDatosVisibles() {
  const { sesion } = useAuth();
  const { solicitudes, cargando: cargandoSol } = useSolicitudes();
  const { mascotas, cargando: cargandoMas } = useMascotas();
  const { citas, cargando: cargandoCit } = useCitas();

  return useMemo(() => {
    const usuario = sesion?.usuario ?? '';
    const verTodo = sesion ? permisosDe(sesion.rol).verTodo : false;
    return {
      solicitudes: verTodo ? solicitudes : solicitudes.filter((s) => s.creadoPor === usuario),
      mascotas: verTodo ? mascotas : mascotas.filter((m) => m.duenoUsuario === usuario),
      citas: verTodo ? citas : citas.filter((c) => c.duenoUsuario === usuario || c.creadoPor === usuario),
      cargando: cargandoSol || cargandoMas || cargandoCit,
    };
  }, [sesion, solicitudes, mascotas, citas, cargandoSol, cargandoMas, cargandoCit]);
}
