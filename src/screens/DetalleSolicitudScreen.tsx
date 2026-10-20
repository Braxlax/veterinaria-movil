import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EstadoChip, PrioridadChip } from '../components/Chip';
import { EmptyState } from '../components/EmptyState';
import { FormField } from '../components/FormField';
import { OptionSelector } from '../components/OptionSelector';
import { PrimaryButton } from '../components/PrimaryButton';
import { ServicioIcon } from '../components/ServicioIcon';
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

  // La pantalla lee siempre la solicitud desde el store (única fuente de verdad)
  const solicitud = obtenerPorId(id ?? '');

  const [estado, setEstado] = useState<EstadoSolicitud>(solicitud?.estado ?? 'PENDIENTE');
  const [prioridad, setPrioridad] = useState<Prioridad>(solicitud?.prioridad ?? 'MEDIA');
  const [descripcion, setDescripcion] = useState(solicitud?.descripcion ?? '');
  const [error, setError] = useState<string | undefined>();

  if (!solicitud) {
    return <EmptyState icon="🔎" title="Solicitud no encontrada" message="Es posible que haya sido eliminada." />;
  }

  const hayCambios =
    estado !== solicitud.estado || prioridad !== solicitud.prioridad || descripcion.trim() !== solicitud.descripcion;

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
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Resumen (solo lectura) */}
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
          <Fila label="Cliente" value={solicitud.clienteNombre} />
          <Fila label="Teléfono" value={solicitud.telefono} />
          <Fila label="Registrada" value={formatearFecha(solicitud.fechaRegistro)} />
        </View>

        {/* Edición */}
        <Text style={styles.section}>Actualizar solicitud</Text>
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
        />

        <PrimaryButton title={hayCambios ? 'Guardar cambios' : 'Sin cambios'} onPress={handleGuardar} />
        <PrimaryButton title="🗑 Eliminar solicitud" variant="danger" onPress={handleEliminar} style={styles.delete} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const Fila = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.fila}>
    <Text style={styles.filaLabel}>{label}</Text>
    <Text style={styles.filaValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  summary: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.xl,
    ...shadow.card,
  },
  summaryHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  mascota: { fontSize: 22, fontWeight: '800', color: colors.text },
  servicio: { fontSize: 14, color: colors.textMuted },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
  fila: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  filaLabel: { fontSize: 13.5, color: colors.textMuted },
  filaValue: { fontSize: 14, fontWeight: '600', color: colors.text, flexShrink: 1, textAlign: 'right' },
  section: { fontSize: 18, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  delete: { marginTop: spacing.md },
});
