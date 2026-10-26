import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '../components/AppIcon';
import { Avatar } from '../components/Avatar';
import { DatoFila } from '../components/DatoFila';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/SectionHeader';
import { useAuth } from '../store/AuthContext';
import { useToast } from '../store/ToastContext';
import { confirmar } from '../utils/alerts';
import { IconName } from '../utils/constants';
import { iniciales } from '../utils/format';
import { permisosDe, ROL_INFO } from '../utils/permisos';
import { colors, radius, shadow, spacing } from '../utils/theme';

const ENLACES: { titulo: string; icon: IconName; ruta: string }[] = [
  { titulo: 'Servicios y precios', icon: 'tag', ruta: '/servicios' },
  { titulo: 'Contacto y ubicación', icon: 'map-marker', ruta: '/contacto' },
];

export default function PerfilScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { sesion, cerrarSesion } = useAuth();

  if (!sesion) return null;
  const p = permisosDe(sesion.rol);
  const info = ROL_INFO[sesion.rol];

  const permisosLista = [
    p.verTodo ? 'Ver solicitudes, citas y mascotas de todos los clientes' : 'Ver y gestionar tus propias mascotas, solicitudes y citas',
    p.editarSolicitud ? 'Actualizar el estado de las solicitudes' : 'Consultar el estado de tus solicitudes',
    p.registrarClinico ? 'Registrar vacunas e historial clínico' : 'Consultar el carnet de vacunación y el historial',
    p.eliminarSolicitud ? 'Eliminar solicitudes' : 'Cancelar tus citas',
  ];

  const salir = () =>
    confirmar('Cerrar sesión', '¿Seguro que deseas salir de tu cuenta?', 'Cerrar sesión', () => {
      cerrarSesion();
      toast('Sesión cerrada', 'info');
    });

  return (
    <ScrollView style={styles.screen} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}>
      <View style={styles.cabecera}>
        <Avatar texto={iniciales(sesion.nombre, sesion.apellidos)} size={84} />
        <Text style={styles.nombre}>
          {sesion.nombre} {sesion.apellidos}
        </Text>
        <View style={styles.rolChip}>
          <AppIcon name={info.icon} size={16} color={colors.primaryDark} />
          <Text style={styles.rolTexto}>{info.label}</Text>
        </View>
        <Text style={styles.rolDesc}>{info.descripcion}</Text>
      </View>

      <View style={styles.card}>
        <DatoFila icon="account" label="Usuario" value={sesion.usuario} />
        <DatoFila icon="email" label="Correo" value={sesion.correo} />
        <DatoFila icon="phone" label="Teléfono" value={sesion.telefono} />
      </View>

      <SectionHeader titulo="Lo que puedes hacer" />
      <View style={styles.card}>
        {permisosLista.map((t) => (
          <View key={t} style={styles.permiso}>
            <AppIcon name="check-circle" size={18} color={colors.success} />
            <Text style={styles.permisoTexto}>{t}</Text>
          </View>
        ))}
      </View>

      <SectionHeader titulo="Información" />
      {ENLACES.map((e) => (
        <Pressable key={e.ruta} onPress={() => router.push(e.ruta as never)} accessibilityRole="button" style={({ pressed }) => [styles.enlace, pressed && { backgroundColor: colors.surfaceAlt }]}>
          <AppIcon name={e.icon} size={22} color={colors.primary} />
          <Text style={styles.enlaceTexto}>{e.titulo}</Text>
          <AppIcon name="chevron-right" size={22} color={colors.textMuted} />
        </Pressable>
      ))}

      <PrimaryButton title="Cerrar sesión" icon="logout" variant="danger" onPress={salir} style={{ marginTop: spacing.xl }} />
      <Text style={styles.version}>Mr. Patitas · versión 1.0.0 · datos en memoria</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  cabecera: { alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg },
  nombre: { fontSize: 22, fontWeight: '800', color: colors.text, marginTop: spacing.sm },
  rolChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primarySoft, paddingHorizontal: spacing.md, paddingVertical: 5, borderRadius: radius.pill },
  rolTexto: { fontSize: 13.5, fontWeight: '800', color: colors.primaryDark },
  rolDesc: { fontSize: 13.5, color: colors.textMuted },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  permiso: { flexDirection: 'row', gap: spacing.sm, alignItems: 'flex-start', paddingVertical: 5 },
  permisoTexto: { flex: 1, fontSize: 14, color: colors.text, lineHeight: 20 },
  enlace: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  enlaceTexto: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text },
  version: { textAlign: 'center', color: colors.textMuted, fontSize: 12, marginTop: spacing.lg },
});
