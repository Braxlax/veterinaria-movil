import { useRouter } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from '../components/EmptyState';
import { FilterChips, FilterOption } from '../components/FilterChips';
import { ResumenEstados } from '../components/ResumenEstados';
import { SearchBar } from '../components/SearchBar';
import { SolicitudCard } from '../components/SolicitudCard';

import {
  ESTADOS,
  EstadoSolicitud,
  Solicitud,
} from '../models/solicitud';

import { solicitudService } from '../services/solicitudService';
import { useSolicitudes } from '../store/SolicitudContext';
import { useToast } from '../store/ToastContext';
import { confirmarEliminacion } from '../utils/alerts';
import { ESTADO_INFO } from '../utils/constants';
import { ordenarSolicitudes } from '../utils/ordenar';
import { radius, spacing } from '../utils/theme';

type Filtro = 'TODOS' | EstadoSolicitud;

export default function ListadoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();


  const { solicitudes, cargando, eliminarSolicitud } =
    useSolicitudes();

  const [busqueda, setBusqueda] = useState('');
  const [filtro, setFiltro] = useState<Filtro>('TODOS');
  const [refrescando, setRefrescando] = useState(false);

  const opciones: FilterOption<Filtro>[] = useMemo(
    () => [
      {
        value: 'TODOS',
        label: 'Todos',
        count: solicitudes.length,
      },
      ...ESTADOS.map((estado) => ({
        value: estado as Filtro,
        label: ESTADO_INFO[estado].label,
        count: solicitudes.filter(
          (solicitud) => solicitud.estado === estado
        ).length,
      })),
    ],
    [solicitudes]
  );

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();

    const resultado = solicitudes.filter((solicitud) => {
      const coincideEstado =
        filtro === 'TODOS' || solicitud.estado === filtro;

      const coincideTexto =
        !q ||
        solicitud.mascotaNombre.toLowerCase().includes(q) ||
        solicitud.clienteNombre.toLowerCase().includes(q) ||
        solicitud.telefono.includes(q);

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
      toast(
        `Solicitud de ${solicitud.mascotaNombre} eliminada`,
        'success'
      );
    });
  };

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/favicon.png')}
          style={{ width: 70, height: 70 }}
          resizeMode="contain"
        />

        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>
            Centro  Médico Mr. Patitas
          </Text>

          <Text style={styles.headerSubtitle}>
            Gestión de solicitudes veterinarias
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.top}>
          <ResumenEstados solicitudes={solicitudes} />

          <SearchBar
            value={busqueda}
            onChangeText={setBusqueda}
          />

          <FilterChips
            options={opciones}
            selected={filtro}
            onSelect={setFiltro}
          />
        </View>

        {cargando ? (
          <View style={styles.loading}>
            <ActivityIndicator
              size="large"
              color="#78943B"
            />

            <Text style={styles.loadingText}>
              Cargando solicitudes...
            </Text>
          </View>
        ) : (
          <FlatList
            data={filtradas}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              styles.list,
              { paddingBottom: insets.bottom + 100 },
            ]}
            refreshControl={
              <RefreshControl
                refreshing={refrescando}
                onRefresh={onRefresh}
                colors={['#78943B']}
                tintColor="#78943B"
              />
            }
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              <EmptyState
                icon="🐶"
                title={
                  solicitudes.length === 0
                    ? 'Aún no hay solicitudes'
                    : 'Sin resultados'
                }
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
                onPress={() =>
                  router.push({
                    pathname: '/detalle',
                    params: { id: item.id },
                  })
                }
                onDelete={() => onEliminar(item)}
              />
            )}
          />
        )}
        <Pressable
          onPress={() => router.replace('/')}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.homeButton,
            { bottom: insets.bottom +15 },
            pressed && styles.fabPressed,
          ]}
        >
          <Text style={styles.homeButtonText}>← Volver al inicio</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push('/crear')}
          accessibilityRole="button"
          accessibilityLabel="Nueva solicitud"
          style={({ pressed }) => [
            styles.fab,
            { bottom: insets.bottom + spacing.lg },
            pressed && styles.fabPressed,
          ]}
        >
          <Text style={styles.fabPlus}>+</Text>
          <Text style={styles.fabText}>Nueva solicitud</Text>
        </Pressable>
        </View></View>
        
  );
}

const styles = StyleSheet.create({
 
homeButton: {
  position: 'relative',
  right: spacing.lg-17,
  backgroundColor: '#78943b',
  paddingVertical: 15,
  paddingHorizontal: 22,
  borderRadius: 82,
  alignItems: 'center',
  justifyContent: 'center',
  alignSelf: 'flex-start',
  elevation: 5,
},

homeButtonText: {
  color: '#FFFFFF',
  fontSize: 15,
  fontWeight: 'bold',
},

  screen: {
    flex: 1,
    backgroundColor: '#b3904b',
  },

  container: {
    flex: 1,
    backgroundColor: '#FFF9ED',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: '#90c420',
    gap: spacing.md,
  },

  headerLogo: {
    width: 56,
    height: 56,
  },

  headerInfo: {
    flex: 1,
  },

  headerTitle: {
    color: '#526b2f',
    fontSize: 18,
    fontWeight: '800',
  },

  headerSubtitle: {
    color: '#777765',
    fontSize: 12,
    marginTop: 4,
  },

  top: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    gap: spacing.sm,
  },

  list: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xs,
  },

  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
  },

  loadingText: {
    color: '#777765',
    fontSize: 14,
  },

  fab: {
    position: 'absolute',
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#78943b',
    paddingHorizontal: spacing.xl,
    minHeight: 54,
    borderRadius: radius.pill,
    elevation: 6,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  fabPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },

  fabPlus: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },

  fabText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
  },
});