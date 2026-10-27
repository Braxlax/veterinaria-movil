import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { CitaCard } from '../components/CitaCard';
import { EmptyState } from '../components/EmptyState';
import { Fab } from '../components/Fab';
import { SelectorDia } from '../components/SelectorDia';
import { useDatosVisibles } from '../hooks/useDatosVisibles';
import { usePermisos } from '../hooks/usePermisos';
import { Cita } from '../models/cita';
import { useAuth } from '../store/AuthContext';
import { useCitas } from '../store/CitaContext';
import { useToast } from '../store/ToastContext';
import { confirmar } from '../utils/alerts';
import { enDias, formatearDiaCorto, formatearHora, mismoDia } from '../utils/fechas';
import { ordenarCitas } from '../utils/ordenar';
import { colors, spacing } from '../utils/theme';

export default function AgendaScreen() {
  const router = useRouter();
  const toast = useToast();
  const { sesion } = useAuth();
  const { cambiarEstadoCita } = useCitas();
  const { citas, cargando } = useDatosVisibles();
  const { gestionarAgenda, verTodo } = usePermisos();
  const esAdmin = sesion?.rol === 'admin';
  const [dia, setDia] = useState<string>(enDias(0, 0));

  const delDia = useMemo(() => ordenarCitas(citas.filter(c => mismoDia(c.fechaHora, dia))), [citas, dia]);

  const programadas = delDia.filter(c => c.estado === 'PROGRAMADA').length;

  const completar = (c: Cita) => {
    cambiarEstadoCita(c.id, 'COMPLETADA');
    toast(`Cita de ${c.mascotaNombre} completada`, 'success');
  };

  const cancelar = (c: Cita) =>
    confirmar('Cancelar cita', `¿Cancelar la cita de ${c.mascotaNombre} a las ${formatearHora(c.fechaHora)}?`, 'Cancelar cita', () => {
      cambiarEstadoCita(c.id, 'CANCELADA');
      toast('Cita cancelada', 'info');
    });

  return (
    <View style={styles.screen}>
      <View style={styles.top}>
        <SelectorDia selected={dia} onSelect={setDia} dias={10} />
        <Text style={styles.resumen}>
          {formatearDiaCorto(dia)} · {delDia.length} {delDia.length === 1 ? 'cita' : 'citas'}
          {delDia.length > 0 ? ` (${programadas} programada${programadas === 1 ? '' : 's'})` : ''}
        </Text>
      </View>

      {cargando ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Cargando agenda...</Text>
        </View>
      ) : (
        <FlatList
          data={delDia}
          keyExtractor={c => c.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              icon="calendar-month"
              title="Sin citas este día"
              message={verTodo ? 'Toca “Agendar cita” para programar una.' : 'Aquí puedes consultar las citas de tu mascota.'}
            />
          }
          renderItem={({ item }) => (
            <CitaCard
              cita={item}
              onCompletar={gestionarAgenda ? () => completar(item) : undefined}
              onCancelar={gestionarAgenda ? () => cancelar(item) : undefined}
            />
          )}
        />
      )}

      {esAdmin && <Fab label="Agendar cita" icon="calendar-plus" onPress={() => router.push('/cita-nueva')} />}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  top: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  resumen: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textMuted,
    marginTop: spacing.xs,
    marginBottom: spacing.sm,
  },
  list: { paddingHorizontal: spacing.lg, paddingBottom: 110 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.md },
  loadingText: { color: colors.textMuted, fontSize: 14 },
});
