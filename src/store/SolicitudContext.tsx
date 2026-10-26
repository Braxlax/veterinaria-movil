import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { CambiosSolicitud, NuevaSolicitud, Solicitud } from '../models/solicitud';
import { solicitudService } from '../services/solicitudService';
import { initialState, solicitudReducer, SolicitudState } from './solicitudReducer';

interface SolicitudContextValue extends SolicitudState {
  agregarSolicitud: (datos: NuevaSolicitud) => Solicitud;
  actualizarSolicitud: (id: string, cambios: CambiosSolicitud) => void;
  eliminarSolicitud: (id: string) => void;
  obtenerPorId: (id: string) => Solicitud | undefined;
}

const SolicitudContext = createContext<SolicitudContextValue | null>(null);

export function SolicitudProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(solicitudReducer, initialState);


  useEffect(() => {
    let activo = true;
    dispatch({ type: 'CARGANDO' });
    solicitudService.obtenerTodas().then((datos) => {
      if (activo) dispatch({ type: 'CARGAR_OK', payload: datos });
    });
    return () => {
      activo = false;
    };
  }, []);

  const agregarSolicitud = useCallback((datos: NuevaSolicitud) => {
    const nueva = solicitudService.crear(datos);
    dispatch({ type: 'AGREGAR', payload: nueva });
    return nueva;
  }, []);

  const actualizarSolicitud = useCallback((id: string, cambios: CambiosSolicitud) => {
    dispatch({ type: 'ACTUALIZAR', payload: { id, cambios } });
  }, []);

  const eliminarSolicitud = useCallback((id: string) => {
    dispatch({ type: 'ELIMINAR', payload: id });
  }, []);

  const obtenerPorId = useCallback(
    (id: string) => state.solicitudes.find((s) => s.id === id),
    [state.solicitudes]
  );

  const value = useMemo(
    () => ({ ...state, agregarSolicitud, actualizarSolicitud, eliminarSolicitud, obtenerPorId }),
    [state, agregarSolicitud, actualizarSolicitud, eliminarSolicitud, obtenerPorId]
  );

  return <SolicitudContext.Provider value={value}>{children}</SolicitudContext.Provider>;
}

export function useSolicitudes(): SolicitudContextValue {
  const ctx = useContext(SolicitudContext);
  if (!ctx) throw new Error('useSolicitudes debe usarse dentro de <SolicitudProvider>');
  return ctx;
}
