import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { CambiosSolicitud, NuevaSolicitud, Solicitud } from '../../domain/entities/solicitud';
import { crearSolicitud } from '../../domain/use-cases/crearSolicitud';
import { solicitudRepository } from '../../infraestructure/repositories/solicitudRepository';
import { initialState, solicitudReducer, SolicitudState } from './solicitudReducer';

interface SolicitudContextValue extends SolicitudState {
  agregarSolicitud: (datos: NuevaSolicitud) => Solicitud;
  actualizarSolicitud: (id: string, cambios: CambiosSolicitud) => void;
  eliminarSolicitud: (id: string) => void;
  obtenerPorId: (id: string) => Solicitud | undefined;
  refrescar: () => Promise<void>;
}

const SolicitudContext = createContext<SolicitudContextValue | null>(null);

export function SolicitudProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(solicitudReducer, initialState);


  useEffect(() => {
    let activo = true;
    dispatch({ type: 'CARGANDO' });
    solicitudRepository.obtenerTodas().then((datos) => {
      if (activo) dispatch({ type: 'CARGAR_OK', payload: datos });
    });
    return () => {
      activo = false;
    };
  }, []);

  const agregarSolicitud = useCallback((datos: NuevaSolicitud) => {
    const nueva = crearSolicitud(datos);
    dispatch({ type: 'AGREGAR', payload: nueva });
    return nueva;
  }, []);

  const actualizarSolicitud = useCallback((id: string, cambios: CambiosSolicitud) => {
    dispatch({ type: 'ACTUALIZAR', payload: { id, cambios } });
  }, []);

  const eliminarSolicitud = useCallback((id: string) => {
    dispatch({ type: 'ELIMINAR', payload: id });
  }, []);

  const refrescar = useCallback(() => solicitudRepository.refrescar(), []);

  const obtenerPorId = useCallback(
    (id: string) => state.solicitudes.find((s) => s.id === id),
    [state.solicitudes]
  );

  const value = useMemo(
    () => ({ ...state, agregarSolicitud, actualizarSolicitud, eliminarSolicitud, obtenerPorId, refrescar }),
    [state, agregarSolicitud, actualizarSolicitud, eliminarSolicitud, obtenerPorId, refrescar]
  );

  return <SolicitudContext.Provider value={value}>{children}</SolicitudContext.Provider>;
}

export function useSolicitudes(): SolicitudContextValue {
  const ctx = useContext(SolicitudContext);
  if (!ctx) throw new Error('useSolicitudes debe usarse dentro de <SolicitudProvider>');
  return ctx;
}
