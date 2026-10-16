import { useRouter } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { FilterChips, FilterOption } from '../components/FilterChips';
import { SearchBar } from '../components/SearchBar';
import { SolicitudCard } from '../components/SolicitudCard';
import { ESTADOS, EstadoSolicitud, Solicitud } from '../models/solicitud';
import { solicitudService } from '../services/solicitudService';
import { useSolicitudes } from '../store/SolicitudContext';
import { useToast } from '../store/ToastContext';
import { confirmarEliminacion } from '../utils/alerts';
import { ESTADO_INFO } from '../utils/constants';
import { colors, radius, spacing } from '../utils/theme';
import { ResumenEstados } from '../components/ResumenEstados';
import { ordenarSolicitudes } from '../utils/ordenar';

type Filtro = 'TODOS' | EstadoSolicitud;

export default function ListadoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { solicitudes, cargando, eliminarSolicitud } = useSolicitudes();

  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('TODOS');
  const [refrescando, setRefrescando] = useState(false);

  const opciones: FilterOption<Filtro>[] = useMemo(
    () => [
      { value: 'TODOS', label: 'Todos', count: solicitudes.length },
      ...ESTADOS.map((e) => ({
        value: e as Filtro,
        label: ESTADO_INFO[e].label,
        count: solicitudes.filter((s) => s.estado === e).length,
      })),
    ],
    [solicitudes]
  );

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    const resultado = solicitudes.filter((s) => {
      const coincideEstado = filtro === 'TODOS' || s.estado === filtro;
      const coincideTexto =
        !q ||
        s.mascotaNombre.toLowerCase().includes(q) ||
        s.clienteNombre.toLowerCase().includes(q) ||
        s.telefono.includes(q);
      return coincideEstado && coincideTexto;
    });
    return ordenarSolicitudes(resultado)
  }, [solicitudes, busqueda, filtro]);

  // Simula "refrescar" la lista (pull to refresh)
  const onRefresh = useCallback(async () => {
    setRefrescando(true);
    await solicitudService.refrescar();
    setRefrescando(false);
    toast('Lista actualizada', 'info');
  }, [toast]);

  const onEliminar = (s: Solicitud) =>
    confirmarEliminacion(s.mascotaNombre, () => {
      eliminarSolicitud(s.id);
      toast(`Solicitud de ${s.mascotaNombre} eliminada`, 'success');
    });

  return (
    <View style={styles.container}>
      <View style={styles.top}>
  <ResumenEstados solicitudes={solicitudes} />
  <SearchBar value={busqueda} onChangeText={setBusqueda} />
        <SearchBar value={busqueda} onChangeText={setBusqueda} />
        <FilterChips options={opciones} selected={filtro} onSelect={setFiltro} />
      </View>

      {cargando ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando solicitudes…</Text>
        </View>
      ) : (
        <FlatList
          data={filtradas}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.list, { paddingBottom: insets.bottom + 100 }]}
          refreshControl={
            <RefreshControl refreshing={refrescando} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
          }
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <EmptyState
              icon="🐶"
              title={solicitudes.length === 0 ? 'Aún no hay solicitudes' : 'Sin resultados'}
              message={
                solicitudes.length === 0
                  ? 'Toca “Nueva solicitud” para registrar la primera.'
                  : 'Prueba con otra búsqueda o cambia el filtro.'
              }
            />
          }
          renderItem={({ item }) => (
            <SolicitudCard
              solicitud={item}
              onPress={() => router.push({ pathname: '/detalle', params: { id: item.id } })}
              onDelete={() => onEliminar(item)}
            />
          )}
        />
      )}

      <Pressable
        onPress={() => router.push('/crear')}
        accessibilityRole="button"
        accessibilityLabel="Nueva solicitud"
        style={({ pressed }) => [styles.fab, { bottom: insets.bottom + spacing.lg }, pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] }]}
      >
        <Text style={styles.fabPlus}>＋</Text>
        <Text style={styles.fabText}>Nueva solicitud</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  list: { paddingHorizontal: spacing.lg, paddingTop: spacing.xs },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText: { color: colors.textMuted, fontSize: 14 },
  fab: {
    position: 'absolute',
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.accent,
    paddingHorizontal: spacing.xl,
    minHeight: 54,
    borderRadius: radius.pill,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  fabPlus: { color: colors.text, fontSize: 20, fontWeight: '700' },
  fabText: { color: colors.text, fontSize: 15, fontWeight: '800' },
});
