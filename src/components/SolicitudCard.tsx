import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Solicitud } from '../models/solicitud';
import { SERVICIO_INFO } from '../utils/constants';
import { formatearFecha } from '../utils/format';
import { colors, radius, shadow, spacing, typography } from '../utils/theme';
import { AppIcon } from './AppIcon';
import { EstadoChip, PrioridadChip } from './Chip';
import { ServicioIcon } from './ServicioIcon';

interface Props {
  solicitud: Solicitud;
  onPress: () => void;

  onDelete?: () => void;
}

export function SolicitudCard({ solicitud, onPress, onDelete }: Props) {
  const barra = solicitud.prioridad === 'ALTA' ? colors.danger : solicitud.prioridad === 'MEDIA' ? colors.accent : colors.brand;
  return (
    <View style={[styles.card, { borderLeftColor: barra }]}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Solicitud de ${solicitud.mascotaNombre}, ${SERVICIO_INFO[solicitud.tipoServicio].label}`}
        style={({ pressed }) => [styles.cardContent, pressed && styles.pressed]}
      >
        <View style={styles.header}>
          <ServicioIcon tipo={solicitud.tipoServicio} />
          <View style={styles.headerText}>
            <Text style={styles.mascota} numberOfLines={1}>
              {solicitud.mascotaNombre}
            </Text>
            <Text style={styles.servicio}>{SERVICIO_INFO[solicitud.tipoServicio].label}</Text>
          </View>
          <EstadoChip estado={solicitud.estado} />
        </View>

        <View style={styles.metaRow}>
          <AppIcon name="account" size={15} color={colors.textMuted} />
          <Text style={styles.meta}>{solicitud.clienteNombre}</Text>
          <AppIcon name="phone" size={15} color={colors.textMuted} />
          <Text style={styles.meta}>{solicitud.telefono}</Text>
        </View>

        <Text style={styles.descripcion} numberOfLines={2}>
          {solicitud.descripcion}
        </Text>

        <View style={styles.footerInfo}>
          <PrioridadChip prioridad={solicitud.prioridad} />
          <Text style={styles.fecha}>{formatearFecha(solicitud.fechaRegistro)}</Text>
        </View>
      </Pressable>

      {onDelete ? (
        <View style={styles.deleteRow}>
          <Pressable
            onPress={onDelete}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Eliminar solicitud de ${solicitud.mascotaNombre}`}
            style={({ pressed }) => [styles.deleteBtn, pressed && styles.deletePressed]}
          >
            <AppIcon name="delete-outline" size={17} color={colors.danger} />
            <Text style={styles.deleteText}>Eliminar</Text>
          </Pressable>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderLeftWidth: 6,
    overflow: 'hidden',
    ...shadow.card,
  },
  cardContent: { padding: spacing.lg },
  pressed: { opacity: 0.9, backgroundColor: colors.surfaceAlt },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, marginBottom: spacing.md },
  headerText: { flex: 1 },
  mascota: { ...typography.subtitulo, color: colors.text },
  servicio: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: spacing.sm, flexWrap: 'wrap' },
  meta: { fontSize: 13, color: colors.textMuted, marginRight: spacing.sm },
  descripcion: { ...typography.cuerpo, color: colors.text, marginBottom: spacing.md },
  footerInfo: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md, gap: 6 },
  fecha: { ...typography.detalle, color: colors.textMuted },
  deleteRow: { alignItems: 'flex-end', paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSoft,
  },
  deletePressed: { opacity: 0.6 },
  deleteText: { fontSize: 13, fontWeight: '700', color: colors.danger },
});
