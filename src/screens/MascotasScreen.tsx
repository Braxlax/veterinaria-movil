import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { Fab } from '../components/Fab';
import { MascotaCard } from '../components/MascotaCard';
import { SearchBar } from '../components/SearchBar';
import { useDatosVisibles } from '../hooks/useDatosVisibles';
import { usePermisos } from '../hooks/usePermisos';
import { colors, spacing } from '../utils/theme';

export default function MascotasScreen() {
  const router = useRouter();
  const { mascotas, cargando } = useDatosVisibles();
  const { verTodo } = usePermisos();
  const [busqueda, setBusqueda] = useState('');

  const filtradas = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return mascotas.filter((m) => !q || m.nombre.toLowerCase().includes(q) || m.duenoNombre.toLowerCase().includes(q) || m.raza.toLowerCase().includes(q));
  }, [mascotas, busqueda]);

  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        <SearchBar value={busqueda} onChangeText={setBusqueda} placeholder="Buscar por mascota, dueño o raza" />
        <Text style={styles.contador}>
          {filtradas.length} {filtradas.length === 1 ? 'mascota' : 'mascotas'}
        </Text>
      </View>

      {cargando ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando mascotas...</Text>
        </View>
      ) : (
        <FlatList
          data={filtradas}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <EmptyState
              icon="paw"
              title={mascotas.length === 0 ? 'Aún no hay mascotas' : 'Sin resultados'}
              message={mascotas.length === 0 ? (verTodo ? 'Registra la primera mascota con el botón de abajo.' : 'Registra a tu mascota para pedir citas y ver su historial.') : 'Prueba con otra búsqueda.'}
            />
          }
          renderItem={({ item }) => <MascotaCard mascota={item} onPress={() => router.push({ pathname: '/mascota-detalle', params: { id: item.id } })} />}
        />
      )}

      <Fab label="Nueva mascota" icon="paw" onPress={() => router.push('/mascota-nueva')} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  contador: { fontSize: 13.5, fontWeight: '700', color: colors.textMuted, marginVertical: spacing.sm },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 110 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText: { color: colors.textMuted, fontSize: 14 },
});
