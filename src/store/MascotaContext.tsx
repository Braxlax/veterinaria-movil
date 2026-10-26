import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { CambiosMascota, Mascota, NuevaMascota } from '../models/mascota';
import { mascotaService } from '../services/mascotaService';
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

  useEffect(() => {
    let activo = true;
    dispatch({ type: 'CARGANDO' });
    mascotaService.obtenerTodas().then((datos) => {
      if (activo) dispatch({ type: 'CARGAR_OK', payload: datos });
    });
    return () => {
      activo = false;
    };
  }, []);

  const agregarMascota = useCallback((datos: NuevaMascota) => {
    const nueva = mascotaService.crear(datos);
    dispatch({ type: 'AGREGAR', payload: nueva });
    return nueva;
  }, []);

  const actualizarMascota = useCallback((id: string, cambios: CambiosMascota) => {
    dispatch({ type: 'ACTUALIZAR', payload: { id, cambios } });
  }, []);

  const eliminarMascota = useCallback((id: string) => dispatch({ type: 'ELIMINAR', payload: id }), []);

  const registrarVacuna = useCallback((id: string, nombre: string, proxima?: string) => {
    dispatch({ type: 'AGREGAR_VACUNA', payload: { id, vacuna: mascotaService.nuevaVacuna(nombre, proxima) } });
  }, []);

  const registrarConsulta = useCallback((id: string, motivo: string, diagnostico: string, tratamiento: string) => {
    dispatch({ type: 'AGREGAR_CONSULTA', payload: { id, consulta: mascotaService.nuevaConsulta(motivo, diagnostico, tratamiento) } });
  }, []);

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
