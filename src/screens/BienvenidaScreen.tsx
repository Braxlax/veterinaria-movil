import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { TIPOS_SERVICIO } from '../models/solicitud';
import { CLINICA_NOMBRE, SERVICIO_INFO } from '../utils/constants';
import { colors, radius, spacing } from '../utils/theme';

export default function BienvenidaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[
        styles.container,
        {
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.xl,
        },
      ]}
    >
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Text style={styles.logoEmoji}>🐾</Text>
        </View>

        <Text style={styles.welcome}>¡Bienvenido!</Text>
        <Text style={styles.title}>{CLINICA_NOMBRE}</Text>

        <Text style={styles.subtitle}>Sistema de gestión de atención veterinaria</Text>

        <View style={styles.services}>
          {TIPOS_SERVICIO.map(t => (
            <View key={t} style={styles.service}>
              <View style={[styles.serviceIcon, { backgroundColor: SERVICIO_INFO[t].color }]}>
                <Text style={styles.serviceEmoji}>{SERVICIO_INFO[t].icon}</Text>
              </View>

              <Text style={styles.serviceLabel}>{SERVICIO_INFO[t].label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>¿Qué deseas hacer hoy?</Text>

        <Text style={styles.hint}>Administra las solicitudes de atención de tus clientes desde un solo lugar.</Text>

        <View style={styles.buttons}>
          <PrimaryButton title="Consultar solicitudes" onPress={() => router.push('/solicitudes')} style={styles.homeButton} />

          <PrimaryButton title="Registrar nueva solicitud" onPress={() => router.push('/crear')} style={styles.homeButton} />
        </View>
      </View>

      <Text style={styles.footer}>{CLINICA_NOMBRE} · Atención veterinaria</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'space-between',
  },
  hero: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoEmoji: {
    fontSize: 50,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primarySoft,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: colors.primarySoft,
    marginTop: spacing.sm,
    textAlign: 'center',
    lineHeight: 22,
  },
  services: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.xxl,
  },
  service: {
    alignItems: 'center',
    gap: spacing.sm,
    minWidth: 75,
  },
  serviceIcon: {
    width: 56,
    height: 56,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceEmoji: {
    fontSize: 26,
  },
  serviceLabel: {
    fontSize: 15,
    color: colors.primarySoft,
    fontWeight: '600',
    textAlign: 'center',
  },
  content: {
    marginTop: spacing.xxl,
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  hint: {
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
    fontSize: 14,
    lineHeight: 21,
  },
  buttons: {
    gap: spacing.md,
  },
  homeButton: {
    backgroundColor: colors.accent,
  },
  footer: {
    color: colors.primarySoft,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
