import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '../components/AppIcon';
import { PrimaryButton } from '../components/PrimaryButton';
import { ServicioIcon } from '../components/ServicioIcon';
import { TIPOS_SERVICIO } from '../models/solicitud';
import { CATALOGO_SERVICIOS, SERVICIO_INFO } from '../utils/constants';
import { formatearPrecio } from '../utils/format';
import { colors, radius, shadow, spacing } from '../utils/theme';

export default function ServiciosScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
      <Text style={styles.intro}>Precios referenciales. El costo final depende de la evaluación del veterinario.</Text>
      {TIPOS_SERVICIO.map((t) => {
        const info = SERVICIO_INFO[t];
        const cat = CATALOGO_SERVICIOS[t];
        return (
          <View key={t} style={styles.card}>
            <View style={styles.top}>
              <ServicioIcon tipo={t} size={52} />
              <View style={{ flex: 1 }}>
                <Text style={styles.titulo}>{info.label}</Text>
                <View style={styles.meta}>
                  <AppIcon name="cash" size={16} color={colors.primary} />
                  <Text style={styles.precio}>Desde {formatearPrecio(cat.precioDesde)}</Text>
                  <AppIcon name="timer-outline" size={16} color={colors.textMuted} />
                  <Text style={styles.duracion}>{cat.duracionMin} min</Text>
                </View>
              </View>
            </View>
            <Text style={styles.desc}>{cat.descripcion}</Text>
            <PrimaryButton title={`Agendar ${info.label.toLowerCase()}`} icon="calendar-plus" variant="outline" onPress={() => router.push({ pathname: '/cita-nueva', params: { servicio: t } })} />
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  intro: { fontSize: 13.5, color: colors.textMuted, marginBottom: spacing.lg },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md, gap: spacing.md, ...shadow.card },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  titulo: { fontSize: 18, fontWeight: '800', color: colors.text },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 3 },
  precio: { fontSize: 13.5, fontWeight: '800', color: colors.primaryDark, marginRight: spacing.sm },
  duracion: { fontSize: 13.5, color: colors.textMuted },
  desc: { fontSize: 14, color: colors.text, lineHeight: 20 },
});
