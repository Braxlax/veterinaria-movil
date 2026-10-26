import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { Cita, EstadoCita, NuevaCita } from '../models/cita';
import { citaService } from '../services/citaService';
import { citaInitialState, citaReducer, CitaState } from './citaReducer';

interface CitaContextValue extends CitaState {
  agendarCita: (datos: NuevaCita) => Cita;
  cambiarEstadoCita: (id: string, estado: EstadoCita) => void;
  eliminarCitasDeMascota: (mascotaId: string) => void;
  horarioOcupado: (veterinario: string, fechaHora: string) => boolean;
}

const CitaContext = createContext<CitaContextValue | null>(null);

export function CitaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(citaReducer, citaInitialState);

  useEffect(() => {
    let activo = true;
    dispatch({ type: 'CARGANDO' });
    citaService.obtenerTodas().then((datos) => {
      if (activo) dispatch({ type: 'CARGAR_OK', payload: datos });
    });
    return () => {
      activo = false;
    };
  }, []);

  const agendarCita = useCallback((datos: NuevaCita) => {
    const nueva = citaService.crear(datos);
    dispatch({ type: 'AGREGAR', payload: nueva });
    return nueva;
  }, []);

  const cambiarEstadoCita = useCallback((id: string, estado: EstadoCita) => {
    dispatch({ type: 'CAMBIAR_ESTADO', payload: { id, estado } });
  }, []);

  const eliminarCitasDeMascota = useCallback((mascotaId: string) => {
    dispatch({ type: 'ELIMINAR_POR_MASCOTA', payload: mascotaId });
  }, []);

  const horarioOcupado = useCallback(
    (veterinario: string, fechaHora: string) => citaService.horarioOcupado(state.citas, veterinario, fechaHora),
    [state.citas]
  );

  const value = useMemo(
    () => ({ ...state, agendarCita, cambiarEstadoCita, eliminarCitasDeMascota, horarioOcupado }),
    [state, agendarCita, cambiarEstadoCita, eliminarCitasDeMascota, horarioOcupado]
  );

  return <CitaContext.Provider value={value}>{children}</CitaContext.Provider>;
}

export function useCitas(): CitaContextValue {
  const ctx = useContext(CitaContext);
  if (!ctx) throw new Error('useCitas debe usarse dentro de <CitaProvider>');
  return ctx;
}
