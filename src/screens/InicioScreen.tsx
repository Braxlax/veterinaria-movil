import { useRouter } from 'expo-router';
import { useMemo } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppIcon } from '../components/AppIcon';
import { Avatar } from '../components/Avatar';
import { Chip } from '../components/Chip';
import { CitaCard } from '../components/CitaCard';
import { estadoVacunacion } from '../components/MascotaCard';
import { ResumenEstados } from '../components/ResumenEstados';
import { SectionHeader } from '../components/SectionHeader';

import { useDatosVisibles } from '../hooks/useDatosVisibles';
import { usePermisos } from '../hooks/usePermisos';
import { useAuth } from '../store/AuthContext';

import { CLINICA_NOMBRE, IconName } from '../utils/constants';
import { iniciales } from '../utils/format';
import { ordenarCitas } from '../utils/ordenar';
import { ROL_INFO } from '../utils/permisos';
import { colors, radius, shadow, spacing } from '../utils/theme';

interface Acceso {
  titulo: string;
  icon: IconName;
  ruta: string;
}

const ACCESOS: Acceso[] = [
  { titulo: 'Nueva solicitud', icon: 'clipboard-text', ruta: '/crear' },
  { titulo: 'Agendar cita', icon: 'calendar-plus', ruta: '/cita-nueva' },
  { titulo: 'Nueva mascota', icon: 'paw', ruta: '/mascota-nueva' },
  { titulo: 'Servicios y precios', icon: 'tag', ruta: '/servicios' },
];

export default function InicioScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const { sesion } = useAuth();
  const { verTodo, crearSolicitud } = usePermisos();
  const { solicitudes, mascotas, citas, cargando } = useDatosVisibles();

  // Solicitudes urgentes pendientes de atención.
  const urgentes = useMemo(() => solicitudes.filter(s => s.prioridad === 'ALTA' && s.estado !== 'FINALIZADO'), [solicitudes]);

  // Próximas citas programadas.
  const proximas = useMemo(
    () =>
      ordenarCitas(citas.filter(c => c.estado === 'PROGRAMADA' && new Date(c.fechaHora).getTime() >= Date.now() - 3_600_000)).slice(0, 3),
    [citas],
  );

  // Recordatorios de vacunación.
  const recordatorios = useMemo(
    () =>
      mascotas
        .map(m => ({ mascota: m, estado: estadoVacunacion(m) }))
        .filter(r => r.estado.label === 'Vacuna vencida' || r.estado.label.startsWith('Vacuna en')),
    [mascotas],
  );

  if (!sesion) return null;

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{
        paddingBottom: insets.bottom + spacing.xl,
      }}
      showsVerticalScrollIndicator={false}
    >
      {/* Encabezado */}
      <View style={[styles.hero, { paddingTop: insets.top + spacing.lg }]}>
        <View style={styles.heroRow}>
          <Avatar texto={iniciales(sesion.nombre, sesion.apellidos)} size={54} />

          <View style={{ flex: 1 }}>
            <Text style={styles.hola}>Hola, {sesion.nombre}</Text>

            <View style={styles.rolRow}>
              <AppIcon name={ROL_INFO[sesion.rol].icon} size={15} color={colors.primarySoft} />
              <Text style={styles.rol}>{ROL_INFO[sesion.rol].label}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.clinica}>{CLINICA_NOMBRE}</Text>
      </View>

      {/* Contenido principal */}
      <View style={styles.body}>
        {cargando ? (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Cargando tu panel...</Text>
          </View>
        ) : (
          <>
            {/* La alerta urgente solo se muestra a quienes pueden ver todo. */}
            {verTodo && urgentes.length > 0 ? (
              <Pressable
                onPress={() => router.push('/solicitudes')}
                accessibilityRole="button"
                accessibilityLabel="Ver solicitudes urgentes"
                style={({ pressed }) => [styles.alerta, pressed && { opacity: 0.85 }]}
              >
                <AppIcon name="ambulance" size={28} color={colors.danger} />

                <View style={{ flex: 1 }}>
                  <Text style={styles.alertaTitulo}>
                    {urgentes.length} {urgentes.length === 1 ? 'solicitud urgente' : 'solicitudes urgentes'}
                  </Text>

                  <Text style={styles.alertaTexto}>Pendientes de atención prioritaria</Text>
                </View>

                <AppIcon name="chevron-right" size={22} color={colors.danger} />
              </Pressable>
            ) : null}

            {/* Resumen de solicitudes */}
            <SectionHeader
              titulo={verTodo ? 'Resumen de solicitudes' : 'Mis solicitudes'}
              accion="Ver todas"
              onAccion={() => router.push('/solicitudes')}
            />

            <ResumenEstados solicitudes={solicitudes} />

            {/* Accesos rápidos */}
            <SectionHeader titulo="Accesos rápidos" />

            <View style={styles.grid}>
              {ACCESOS.filter(a => a.ruta !== '/crear' || crearSolicitud).map(a => (
                <Pressable
                  key={a.ruta}
                  onPress={() => router.push(a.ruta as never)}
                  accessibilityRole="button"
                  accessibilityLabel={a.titulo}
                  style={({ pressed }) => [styles.tile, pressed && styles.tilePressed]}
                >
                  <View style={styles.tileIcon}>
                    <AppIcon name={a.icon} size={26} color={colors.primary} />
                  </View>

                  <Text style={styles.tileText}>{a.titulo}</Text>
                </Pressable>
              ))}
            </View>

            {/* Próximas citas */}
            <SectionHeader titulo="Próximas citas" accion="Ver agenda" onAccion={() => router.push('/agenda')} />

            {proximas.length === 0 ? (
              <View style={styles.vacio}>
                <AppIcon name="calendar-month" size={24} color={colors.textMuted} />
                <Text style={styles.vacioTexto}>No hay citas programadas por ahora.</Text>
              </View>
            ) : (
              proximas.map(c => <CitaCard key={c.id} cita={c} />)
            )}

            {/* Recordatorios de vacunas */}
            {recordatorios.length > 0 ? (
              <>
                <SectionHeader titulo="Recordatorios de vacunas" />

                {recordatorios.slice(0, 4).map(({ mascota, estado }) => (
                  <Pressable
                    key={mascota.id}
                    onPress={() =>
                      router.push({
                        pathname: '/mascota-detalle',
                        params: { id: mascota.id },
                      })
                    }
                    accessibilityRole="button"
                    style={({ pressed }) => [
                      styles.recordatorio,
                      pressed && {
                        backgroundColor: colors.surfaceAlt,
                      },
                    ]}
                  >
                    <AppIcon name="bell-ring" size={20} color={colors.warning} />

                    <Text style={styles.recNombre}>{mascota.nombre}</Text>

                    <Chip {...estado} />
                  </Pressable>
                ))}
              </>
            ) : null}
          </>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },

  hero: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl + spacing.sm,
    borderBottomLeftRadius: radius.lg + 8,
    borderBottomRightRadius: radius.lg + 8,
  },

  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  hola: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.white,
  },

  rolRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },

  rol: {
    fontSize: 13.5,
    color: colors.primarySoft,
    fontWeight: '600',
  },

  clinica: {
    marginTop: spacing.lg,
    fontSize: 13.5,
    color: colors.primarySoft,
    fontWeight: '600',
  },

  body: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.md,
  },

  loading: {
    alignItems: 'center',
    paddingVertical: spacing.xxl * 2,
    gap: spacing.md,
  },

  loadingText: {
    color: colors.textMuted,
    fontSize: 14,
  },

  alerta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.dangerSoft,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.dangerBorder,
    marginTop: spacing.lg,
  },

  alertaTitulo: {
    fontSize: 15.5,
    fontWeight: '800',
    color: colors.danger,
  },

  alertaTexto: {
    fontSize: 13,
    color: colors.text,
    marginTop: 1,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },

  tile: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.sm,
    ...shadow.card,
  },

  tilePressed: {
    backgroundColor: colors.surfaceAlt,
    transform: [{ scale: 0.98 }],
  },

  tileIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tileText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: colors.text,
  },

  vacio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },

  vacioTexto: {
    color: colors.textMuted,
    fontSize: 14,
  },

  recordatorio: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.sm,
  },

  recNombre: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
});
