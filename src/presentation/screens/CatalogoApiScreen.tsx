import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { obtenerCatalogoProductos, ProductoApi } from '../../infraestructure/services/catalogoService';
import { AppIcon } from '../components/AppIcon';
import { colors, radius, spacing } from '../theme/theme';

export default function CatalogoApiScreen() {
  const [productos, setProductos] = useState<ProductoApi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      setProductos(await obtenerCatalogoProductos());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo cargar el catálogo.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { void cargar(); }, [cargar]);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.intro}>Esta pantalla demuestra el consumo de una API REST externa. Los productos son datos de ejemplo y no corresponden a los servicios veterinarios de Mr. Patitas.</Text>
      {cargando ? (
        <View style={styles.estado}><ActivityIndicator size="large" color={colors.primary} /><Text style={styles.estadoTexto}>Consultando el servicio REST…</Text></View>
      ) : error ? (
        <View style={styles.estado}>
          <AppIcon name="wifi-off" size={32} color={colors.danger} />
          <Text style={styles.error}>{error}</Text>
          <Pressable onPress={() => void cargar()} style={styles.retry}><AppIcon name="refresh" color={colors.white} size={18} /><Text style={styles.retryText}>Reintentar</Text></Pressable>
        </View>
      ) : (
        <>
          <Text style={styles.count}>{productos.length} productos recibidos desde la API</Text>
          {productos.map((producto) => (
            <View key={producto.id} style={styles.card}>
              {producto.thumbnail ? <Image source={{ uri: producto.thumbnail }} style={styles.image} resizeMode="contain" /> : null}
              <View style={styles.info}>
                <Text style={styles.title}>{producto.title}</Text>
                <Text style={styles.category}>{producto.category}</Text>
                <Text style={styles.description} numberOfLines={3}>{producto.description}</Text>
                <Text style={styles.price}>US$ {producto.price.toFixed(2)} (referencia de API)</Text>
              </View>
            </View>
          ))}
          <Pressable onPress={() => void cargar()} style={styles.retry}><AppIcon name="refresh" color={colors.white} size={18} /><Text style={styles.retryText}>Actualizar catálogo</Text></Pressable>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xxl },
  intro: { color: colors.textMuted, fontSize: 13, lineHeight: 19, marginBottom: spacing.md },
  count: { color: colors.text, fontWeight: '800', marginBottom: spacing.md },
  card: { flexDirection: 'row', gap: spacing.md, padding: spacing.md, marginBottom: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border },
  image: { width: 94, height: 94, backgroundColor: colors.white, borderRadius: radius.md },
  info: { flex: 1, gap: 4 },
  title: { color: colors.text, fontSize: 15, fontWeight: '800' },
  category: { color: colors.primary, fontSize: 12, fontWeight: '700', textTransform: 'capitalize' },
  description: { color: colors.textMuted, fontSize: 12, lineHeight: 17 },
  price: { color: colors.text, fontSize: 13, fontWeight: '800', marginTop: 3 },
  estado: { alignItems: 'center', justifyContent: 'center', gap: spacing.md, paddingVertical: spacing.xxl },
  estadoTexto: { color: colors.textMuted },
  error: { color: colors.danger, textAlign: 'center' },
  retry: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: spacing.md, borderRadius: radius.md, backgroundColor: colors.primary, marginTop: spacing.sm },
  retryText: { color: colors.white, fontWeight: '800' },
});
