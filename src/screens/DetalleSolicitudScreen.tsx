import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EstadoChip, PrioridadChip } from '../components/Chip';
import { DatoFila } from '../components/DatoFila';
import { EmptyState } from '../components/EmptyState';
import { FormField } from '../components/FormField';
import { OptionSelector } from '../components/OptionSelector';
import { PrimaryButton } from '../components/PrimaryButton';
import { SectionHeader } from '../components/SectionHeader';
import { ServicioIcon } from '../components/ServicioIcon';
import { usePermisos } from '../hooks/usePermisos';
import { EstadoSolicitud, ESTADOS, Prioridad, PRIORIDADES } from '../models/solicitud';
import { useSolicitudes } from '../store/SolicitudContext';
import { useToast } from '../store/ToastContext';
import { confirmarEliminacion } from '../utils/alerts';
import { ESTADO_INFO, PRIORIDAD_INFO, SERVICIO_INFO } from '../utils/constants';
import { formatearFecha } from '../utils/format';
import { colors, radius, shadow, spacing } from '../utils/theme';
import { validarDescripcion } from '../utils/validators';

export default function DetalleSolicitudScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { obtenerPorId, actualizarSolicitud, eliminarSolicitud } = useSolicitudes();
  const { editarSolicitud: puedeEditar, eliminarSolicitud: puedeEliminar, verTodo } = usePermisos();

  const solicitud = obtenerPorId(id ?? '');

  const [estado, setEstado] = useState<EstadoSolicitud>(solicitud?.estado ?? 'PENDIENTE');
  const [prioridad, setPrioridad] = useState<Prioridad>(solicitud?.prioridad ?? 'MEDIA');
  const [descripcion, setDescripcion] = useState(solicitud?.descripcion ?? '');
  const [error, setError] = useState<string | undefined>();

  if (!solicitud) {
    return <EmptyState icon="magnify" title="Solicitud no encontrada" message="Es posible que haya sido eliminada." />;
  }

  const hayCambios = estado !== solicitud.estado || prioridad !== solicitud.prioridad || descripcion.trim() !== solicitud.descripcion;

  const onChangeDescripcion = (t: string) => {
    setDescripcion(t);
    if (error) setError(validarDescripcion(t));
  };

  const handleGuardar = () => {
    const err = validarDescripcion(descripcion);
    setError(err);
    if (err) {
      toast('Revisa la descripción', 'error');
      return;
    }
    actualizarSolicitud(solicitud.id, { estado, prioridad, descripcion: descripcion.trim() });
    toast('Solicitud actualizada correctamente', 'success');
    router.back();
  };

  const handleEliminar = () =>
    confirmarEliminacion(solicitud.mascotaNombre, () => {
      router.back();
      eliminarSolicitud(solicitud.id);
      toast(`Solicitud de ${solicitud.mascotaNombre} eliminada`, 'success');
    });

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]} keyboardShouldPersistTaps="handled">

        <View style={styles.summary}>
          <View style={styles.summaryHeader}>
            <ServicioIcon tipo={solicitud.tipoServicio} size={56} />
            <View style={styles.flex}>
              <Text style={styles.mascota}>{solicitud.mascotaNombre}</Text>
              <Text style={styles.servicio}>{SERVICIO_INFO[solicitud.tipoServicio].label}</Text>
            </View>
          </View>
          <View style={styles.chips}>
            <EstadoChip estado={solicitud.estado} />
            <PrioridadChip prioridad={solicitud.prioridad} />
          </View>
          <DatoFila icon="account" label="Cliente" value={solicitud.clienteNombre} />
          <DatoFila icon="phone" label="Teléfono" value={solicitud.telefono} />
          <DatoFila icon="clock-outline" label="Registrada" value={formatearFecha(solicitud.fechaRegistro)} />
        </View>

        {verTodo ? (
          <View style={styles.contactRow}>
            <PrimaryButton title="Llamar" icon="phone" variant="outline" onPress={() => Linking.openURL(`tel:${solicitud.telefono}`)} style={styles.flexBtn} />
            <PrimaryButton title="WhatsApp" icon="whatsapp" variant="outline" onPress={() => Linking.openURL(`https://wa.me/51${solicitud.telefono}`)} style={styles.flexBtn} />
          </View>
        ) : null}

        {puedeEditar ? (
          <>
            <SectionHeader titulo="Actualizar solicitud" />
            <OptionSelector
              label="Estado de atención"
              selected={estado}
              onSelect={setEstado}
              options={ESTADOS.map((e) => ({ value: e, label: ESTADO_INFO[e].label }))}
            />
            <OptionSelector
              label="Prioridad"
              selected={prioridad}
              onSelect={setPrioridad}
              options={PRIORIDADES.map((p) => ({ value: p, label: PRIORIDAD_INFO[p].label }))}
            />
            <FormField
              label="Descripción"
              required
              multiline
              maxLength={300}
              value={descripcion}
              onChangeText={onChangeDescripcion}
              error={error}
              placeholder="Describe el motivo de la atención"
            />
            <PrimaryButton title={hayCambios ? 'Guardar cambios' : 'Sin cambios por guardar'} icon="check" onPress={handleGuardar} />
          </>
        ) : (
          <>
            <SectionHeader titulo="Motivo de la solicitud" />
            <Text style={styles.descLectura}>{solicitud.descripcion}</Text>
          </>
        )}

        <PrimaryButton
          title="Agendar una cita"
          icon="calendar-plus"
          variant="outline"
          onPress={() =>
            router.push({
              pathname: '/cita-nueva',
              params: { ...(solicitud.mascotaId ? { mascotaId: solicitud.mascotaId } : {}), servicio: solicitud.tipoServicio },
            })
          }
          style={{ marginTop: spacing.md }}
        />
        {puedeEliminar ? (
          <PrimaryButton title="Eliminar solicitud" icon="delete-outline" variant="danger" onPress={handleEliminar} style={{ marginTop: spacing.sm }} />
        ) : null}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  flexBtn: { flex: 1 },
  content: { padding: spacing.lg },
  summary: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  mascota: { fontSize: 22, fontWeight: '800', color: colors.text },
  servicio: { fontSize: 14, color: colors.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.sm },
  contactRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  descLectura: { fontSize: 15, lineHeight: 22, color: colors.text, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.lg, borderWidth: 1, borderColor: colors.border },
});
