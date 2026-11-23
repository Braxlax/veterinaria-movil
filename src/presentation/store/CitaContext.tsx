import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { Cita, EstadoCita, NuevaCita } from '../../domain/entities/cita';
import { crearCita, verificarHorarioOcupado } from '../../domain/use-cases/agendarCita';
import { citaRepository } from '../../infraestructure/repositories/citaRepository';
import { escucharCambiosLocales } from '../../infraestructure/database/databaseEvents';
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

  useEffect(() => escucharCambiosLocales((tipo) => {
    if (tipo !== 'citas') return;
    citaRepository.obtenerTodas().then((datos) => dispatch({ type: 'CARGAR_OK', payload: datos })).catch((error) => console.warn('[SQLite] No se pudo actualizar el estado local:', error));
  }), []);

  useEffect(() => {
    let activo = true;
    dispatch({ type: 'CARGANDO' });
    citaRepository.obtenerTodas().then((datos) => {
      if (activo) dispatch({ type: 'CARGAR_OK', payload: datos });
    }).catch((error) => {
      console.error('[SQLite] No se pudieron cargar las citas:', error);
      if (activo) dispatch({ type: 'CARGAR_OK', payload: [] });
    });
    return () => {
      activo = false;
    };
  }, []);

  const agendarCita = useCallback((datos: NuevaCita) => {
    const nueva = crearCita(datos);
    dispatch({ type: 'AGREGAR', payload: nueva });
    void citaRepository.guardar(nueva).catch((error) => console.warn('[SQLite] No se pudo guardar la cita:', error));
    return nueva;
  }, []);

  const cambiarEstadoCita = useCallback((id: string, estado: EstadoCita) => {
    dispatch({ type: 'CAMBIAR_ESTADO', payload: { id, estado } });
    const actual = state.citas.find((c) => c.id === id);
    if (actual) void citaRepository.guardar({ ...actual, estado }).catch((error) => console.warn('[SQLite] No se pudo actualizar la cita:', error));
  }, [state.citas]);

  const eliminarCitasDeMascota = useCallback((mascotaId: string) => {
    dispatch({ type: 'ELIMINAR_POR_MASCOTA', payload: mascotaId });
    state.citas.filter((c) => c.mascotaId === mascotaId).forEach((c) => {
      void citaRepository.eliminar(c.id).catch((error) => console.warn('[SQLite] No se pudo eliminar la cita:', error));
    });
  }, [state.citas]);

  const horarioOcupado = useCallback(
    (veterinario: string, fechaHora: string) => verificarHorarioOcupado(state.citas, veterinario, fechaHora),
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
