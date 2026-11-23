import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { CambiosMascota, Mascota, NuevaMascota } from '../../domain/entities/mascota';
import { crearMascota } from '../../domain/use-cases/crearMascota';
import { crearConsulta, crearVacuna } from '../../domain/use-cases/registrarHistorialClinico';
import { mascotaRepository } from '../../infraestructure/repositories/mascotaRepository';
import { escucharCambiosLocales } from '../../infraestructure/database/databaseEvents';
import { mascotaInitialState, mascotaReducer, MascotaState } from './mascotaReducer';

interface MascotaContextValue extends MascotaState {
  agregarMascota: (datos: NuevaMascota) => Mascota;
  actualizarMascota: (id: string, cambios: CambiosMascota) => void;
  eliminarMascota: (id: string) => void;
  registrarVacuna: (id: string, nombre: string, proxima?: string) => void;
  registrarConsulta: (id: string, motivo: string, diagnostico: string, tratamiento: string) => void;
  obtenerMascota: (id: string) => Mascota | undefined;
}

const MascotaContext = createContext<MascotaContextValue | null>(null);

export function MascotaProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(mascotaReducer, mascotaInitialState);

  useEffect(() => escucharCambiosLocales((tipo) => {
    if (tipo !== 'mascotas') return;
    mascotaRepository.obtenerTodas().then((datos) => dispatch({ type: 'CARGAR_OK', payload: datos })).catch((error) => console.warn('[SQLite] No se pudo actualizar el estado local:', error));
  }), []);

  useEffect(() => {
    let activo = true;
    dispatch({ type: 'CARGANDO' });
    mascotaRepository.obtenerTodas().then((datos) => {
      if (activo) dispatch({ type: 'CARGAR_OK', payload: datos });
    }).catch((error) => {
      console.error('[SQLite] No se pudieron cargar las mascotas:', error);
      if (activo) dispatch({ type: 'CARGAR_OK', payload: [] });
    });
    return () => {
      activo = false;
    };
  }, []);

  const agregarMascota = useCallback((datos: NuevaMascota) => {
    const nueva = crearMascota(datos);
    dispatch({ type: 'AGREGAR', payload: nueva });
    void mascotaRepository.guardar(nueva).catch((error) => console.warn('[SQLite] No se pudo guardar la mascota:', error));
    return nueva;
  }, []);

  const actualizarMascota = useCallback((id: string, cambios: CambiosMascota) => {
    dispatch({ type: 'ACTUALIZAR', payload: { id, cambios } });
    const actual = state.mascotas.find((m) => m.id === id);
    if (actual) void mascotaRepository.guardar({ ...actual, ...cambios }).catch((error) => console.warn('[SQLite] No se pudo actualizar la mascota:', error));
  }, [state.mascotas]);

  const eliminarMascota = useCallback((id: string) => {
    dispatch({ type: 'ELIMINAR', payload: id });
    void mascotaRepository.eliminar(id).catch((error) => console.warn('[SQLite] No se pudo eliminar la mascota:', error));
  }, []);

  const registrarVacuna = useCallback((id: string, nombre: string, proxima?: string) => {
    const vacuna = crearVacuna(nombre, proxima);
    dispatch({ type: 'AGREGAR_VACUNA', payload: { id, vacuna } });
    const actual = state.mascotas.find((m) => m.id === id);
    if (actual) void mascotaRepository.guardar({ ...actual, vacunas: [vacuna, ...actual.vacunas] }).catch((error) => console.warn('[SQLite] No se pudo guardar la vacuna:', error));
  }, [state.mascotas]);

  const registrarConsulta = useCallback((id: string, motivo: string, diagnostico: string, tratamiento: string) => {
    const consulta = crearConsulta(motivo, diagnostico, tratamiento);
    dispatch({ type: 'AGREGAR_CONSULTA', payload: { id, consulta } });
    const actual = state.mascotas.find((m) => m.id === id);
    if (actual) void mascotaRepository.guardar({ ...actual, historial: [consulta, ...actual.historial] }).catch((error) => console.warn('[SQLite] No se pudo guardar la consulta:', error));
  }, [state.mascotas]);

  const obtenerMascota = useCallback((id: string) => state.mascotas.find((m) => m.id === id), [state.mascotas]);

  const value = useMemo(
    () => ({ ...state, agregarMascota, actualizarMascota, eliminarMascota, registrarVacuna, registrarConsulta, obtenerMascota }),
    [state, agregarMascota, actualizarMascota, eliminarMascota, registrarVacuna, registrarConsulta, obtenerMascota]
  );

  return <MascotaContext.Provider value={value}>{children}</MascotaContext.Provider>;
}

export function useMascotas(): MascotaContextValue {
  const ctx = useContext(MascotaContext);
  if (!ctx) throw new Error('useMascotas debe usarse dentro de <MascotaProvider>');
  return ctx;
}
