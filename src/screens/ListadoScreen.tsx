import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { Fab } from '../components/Fab';
import { FilterChips, FilterOption } from '../components/FilterChips';
import { ResumenEstados } from '../components/ResumenEstados';
import { SearchBar } from '../components/SearchBar';
import { SolicitudCard } from '../components/SolicitudCard';
import { useDatosVisibles } from '../hooks/useDatosVisibles';
import { usePermisos } from '../hooks/usePermisos';
import { ESTADOS, EstadoSolicitud, Solicitud } from '../models/solicitud';
import { solicitudService } from '../services/solicitudService';
import { useSolicitudes } from '../store/SolicitudContext';
import { useToast } from '../store/ToastContext';
import { confirmarEliminacion } from '../utils/alerts';
import { ESTADO_INFO } from '../utils/constants';
import { ordenarSolicitudes } from '../utils/ordenar';
import { colors, spacing } from '../utils/theme';

type Filtro = 'TODOS' | EstadoSolicitud;

export default function ListadoScreen() {
  const router = useRouter();
  const toast = useToast();
  const { eliminarSolicitud } = useSolicitudes();
  const { solicitudes, cargando } = useDatosVisibles();
  const { eliminarSolicitud: puedeEliminar, crearSolicitud, verTodo } = usePermisos();

  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('TODOS');
  const [refrescando, setRefrescando] = useState(false);

  const opciones: FilterOption<Filtro>[] = useMemo(
    () => [
      { value: 'TODOS', label: 'Todos', count: solicitudes.length },
      ...ESTADOS.map((estado) => ({
        value: estado as Filtro,
        label: ESTADO_INFO[estado].label,
        count: solicitudes.filter((s) => s.estado === estado).length,
      })),
    ],
    [solicitudes]
  );

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const resultado = solicitudes.filter((s) => {
      const coincideEstado = filtro === 'TODOS' || s.estado === filtro;
      const coincideTexto =
        !q || s.mascotaNombre.toLowerCase().includes(q) || s.clienteNombre.toLowerCase().includes(q) || s.telefono.includes(q);
      return coincideEstado && coincideTexto;
    });
    return ordenarSolicitudes(resultado);
  }, [solicitudes, busqueda, filtro]);

  const onRefresh = useCallback(async () => {
    setRefrescando(true);
    try {
      await solicitudService.refrescar();
      toast('Lista actualizada', 'info');
    } catch {
      toast('No se pudo actualizar la lista', 'error');
    } finally {
      setRefrescando(false);
    }
  }, [toast]);

  const onEliminar = (solicitud: Solicitud) => {
    confirmarEliminacion(solicitud.mascotaNombre, () => {
      eliminarSolicitud(solicitud.id);
      toast(`Solicitud de ${solicitud.mascotaNombre} eliminada`, 'success');
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        <ResumenEstados solicitudes={solicitudes} />
        <SearchBar value={busqueda} onChangeText={setBusqueda} />
        <FilterChips options={opciones} selected={filtro} onSelect={setFiltro} />
      </View>

      {cargando ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando solicitudes...</Text>
        </View>
      ) : (
        <FlatList
          data={filtradas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <EmptyState
              icon="clipboard-text"
              title={solicitudes.length === 0 ? 'Aún no hay solicitudes' : 'Sin resultados'}
              message={
                solicitudes.length === 0
                  ? verTodo
                    ? 'Toca “Nueva solicitud” para registrar la primera.'
                    : 'Cuando pidas atención para tu mascota, la verás aquí.'
                  : 'Prueba con otra búsqueda o cambia el filtro.'
              }
            />
          }
          renderItem={({ item }) => (
            <SolicitudCard
              solicitud={item}
              onPress={() => router.push({ pathname: '/detalle', params: { id: item.id } })}
              onDelete={puedeEliminar ? () => onEliminar(item) : undefined}
            />
          )}
        />
      )}

      {crearSolicitud ? <Fab label="Nueva solicitud" onPress={() => router.push('/crear')} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 110 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText: { color: colors.textMuted, fontSize: 14 },
});
