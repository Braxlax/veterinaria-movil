import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { TIPOS_SERVICIO } from '../models/solicitud';
import { CLINICA_NOMBRE, SERVICIO_INFO } from '../utils/constants';
import { radius, spacing } from '../utils/theme';

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
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/tabIcons/mr.patitas.png')} style={styles.logoImage} resizeMode="contain" />
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
    backgroundColor: '#7E9936',
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
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#FFF9ED',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  logoImage: {
    width: 140,
    height: 140,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF9ED',
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFF9ED',
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
    color: '#FFF9ED',
    fontWeight: '700',
    textAlign: 'center',
  },
  content: {
    marginTop: spacing.xxl,
    backgroundColor: '#FFF9ED',
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  sectionTitle: {
    color: '#34421D',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  hint: {
    color: '#626653',
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
    backgroundColor: '#FB923C',
  },
  footer: {
    color: '#FFF9ED',
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
