import { useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '../components/AppIcon';
import { PrimaryButton } from '../components/PrimaryButton';
import { usePermisos } from '../hooks/usePermisos';
import { TIPOS_SERVICIO } from '../models/solicitud';
import { useAuth } from '../store/AuthContext';
import { confirmar } from '../utils/alerts';
import { CLINICA_NOMBRE, SERVICIO_INFO } from '../utils/constants';
import { ROL_INFO } from '../utils/permisos';
import { colors, radius, spacing } from '../utils/theme';

export default function BienvenidaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { sesion, cerrarSesion } = useAuth();
  const { crearSolicitud } = usePermisos();

  const esCliente = sesion?.rol === 'cliente';
  const rol = sesion ? ROL_INFO[sesion.rol] : null;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + spacing.xl, paddingBottom: insets.bottom + spacing.xl }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.hero}>
        <View style={styles.logoContainer}>
          <Image source={require('../../assets/images/tabIcons/mr.patitas.png')} style={styles.logoImage} resizeMode="contain" />
        </View>

        <Text style={styles.welcome}>¡Bienvenido{sesion ? `, ${sesion.nombre}` : ''}!</Text>
        <Text style={styles.title}>{CLINICA_NOMBRE}</Text>
        <Text style={styles.subtitle}>Sistema de gestión de atención veterinaria</Text>

        {rol ? (
          <View style={styles.rolChip}>
            <AppIcon name={rol.icon} size={16} color={colors.primaryDark} />
            <Text style={styles.rolText}>{rol.label}</Text>
          </View>
        ) : null}

        <View style={styles.services}>
          {TIPOS_SERVICIO.map((t) => (
            <View key={t} style={styles.service}>
              <View style={[styles.serviceIcon, { backgroundColor: SERVICIO_INFO[t].color }]}>
                <AppIcon name={SERVICIO_INFO[t].icon} size={28} color={SERVICIO_INFO[t].fg} />
              </View>
              <Text style={styles.serviceLabel}>{SERVICIO_INFO[t].label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>¿Qué deseas hacer hoy?</Text>
        <Text style={styles.hint}>
          {esCliente
            ? 'Consulta el estado de tus solicitudes, pide atención para tu mascota o agenda una cita.'
            : 'Administra las solicitudes de atención de tus clientes desde un solo lugar.'}
        </Text>

        <View style={styles.buttons}>
          <PrimaryButton
            title={esCliente ? 'Consultar mis solicitudes' : 'Consultar solicitudes'}
            icon="clipboard-text"
            onPress={() => router.push('/solicitudes')}
          />
          {crearSolicitud ? <PrimaryButton title="Registrar nueva solicitud" icon="plus" onPress={() => router.push('/crear')} /> : null}
          <PrimaryButton title="Ir a mi panel" icon="home-variant" variant="outline" onPress={() => router.push('/inicio')} />
          <PrimaryButton
            title="Cerrar sesión"
            icon="logout"
            variant="danger"
            onPress={() => confirmar('Cerrar sesión', '¿Seguro que deseas salir de tu cuenta?', 'Cerrar sesión', cerrarSesion)}
          />
        </View>
      </View>

      <Text style={styles.footer}>{CLINICA_NOMBRE} · Atención veterinaria</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: colors.primary },
  container: { flexGrow: 1, paddingHorizontal: spacing.xl, justifyContent: 'space-between' },
  hero: { alignItems: 'center', marginTop: spacing.lg },
  logoContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  logoImage: { width: 140, height: 140 },
  welcome: { fontSize: 22, fontWeight: '700', color: colors.background, textAlign: 'center', marginBottom: spacing.sm },
  title: { fontSize: 28, fontWeight: '800', color: colors.white, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.background, marginTop: spacing.sm, textAlign: 'center', lineHeight: 22 },
  rolChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.primarySoft,
    paddingHorizontal: spacing.md,
    paddingVertical: 5,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  rolText: { fontSize: 13.5, fontWeight: '800', color: colors.primaryDark },
  services: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: spacing.lg, marginTop: spacing.xxl },
  service: { alignItems: 'center', gap: spacing.sm, minWidth: 75 },
  serviceIcon: { width: 56, height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  serviceLabel: { fontSize: 15, color: colors.background, fontWeight: '700', textAlign: 'center' },
  content: { marginTop: spacing.xxl, backgroundColor: colors.background, borderRadius: radius.lg, padding: spacing.xl },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: '800', textAlign: 'center' },
  hint: { color: colors.textMuted, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.lg, fontSize: 14, lineHeight: 21 },
  buttons: { gap: spacing.md },
  footer: { color: colors.background, fontSize: 12, textAlign: 'center', marginTop: spacing.xl },
});
