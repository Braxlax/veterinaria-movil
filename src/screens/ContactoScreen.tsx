import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '../components/AppIcon';
import { DatoFila } from '../components/DatoFila';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/SectionHeader';
import { useToast } from '../store/ToastContext';
import { CLINICA, CLINICA_NOMBRE } from '../utils/constants';
import { colors, radius, shadow, spacing } from '../utils/theme';

export default function ContactoScreen() {
  const insets = useSafeAreaInsets();
  const toast = useToast();

  const abrir = (url: string) =>
    Linking.openURL(url).catch(() => toast('No se pudo abrir la aplicación en este dispositivo', 'error'));

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
      <View style={styles.emergencia}>
        <View style={styles.emergenciaTop}>
          <AppIcon name="ambulance" size={34} color={colors.danger} />
          <View style={{ flex: 1 }}>
            <Text style={styles.emergenciaTitulo}>Emergencias 24 horas</Text>
            <Text style={styles.emergenciaTexto}>Si tu mascota está en peligro, llama ahora.</Text>
          </View>
        </View>
        <PrimaryButton title={`Llamar ${CLINICA.telefonoVisible}`} icon="phone" onPress={() => abrir(`tel:${CLINICA.telefono}`)} style={{ backgroundColor: colors.danger }} />
      </View>

      <SectionHeader titulo={CLINICA_NOMBRE} />
      <View style={styles.card}>
        <DatoFila icon="map-marker" label="Dirección" value={CLINICA.direccion} />
        <DatoFila icon="phone" label="Teléfono" value={CLINICA.telefonoVisible} />
        <DatoFila icon="email" label="Correo" value={CLINICA.correo} />
      </View>

      <View style={styles.botones}>
        <PrimaryButton title="Escribir por WhatsApp" icon="whatsapp" onPress={() => abrir(`https://wa.me/${CLINICA.whatsapp}`)} />
        <PrimaryButton title="Cómo llegar" icon="map-marker" variant="outline" onPress={() => abrir(CLINICA.mapa)} />
      </View>

      <SectionHeader titulo="Horario de atención" />
      <View style={styles.card}>
        {CLINICA.horario.map((h) => (
          <View key={h.dias} style={styles.horaFila}>
            <AppIcon name="store-clock" size={18} color={colors.primary} />
            <Text style={styles.horaDias}>{h.dias}</Text>
            <Text style={styles.horaHoras}>{h.horas}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  emergencia: { backgroundColor: colors.dangerSoft, borderRadius: radius.lg, padding: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: colors.dangerBorder },
  emergenciaTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  emergenciaTitulo: { fontSize: 18, fontWeight: '800', color: colors.danger },
  emergenciaTexto: { fontSize: 13.5, color: colors.text },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  botones: { gap: spacing.sm, marginTop: spacing.md },
  horaFila: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 },
  horaDias: { flex: 1, fontSize: 14, color: colors.text },
  horaHoras: { fontSize: 14, fontWeight: '700', color: colors.text },
});
