import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Solicitud } from '../models/solicitud';
import { SERVICIO_INFO } from '../utils/constants';
import { formatearFecha } from '../utils/format';
import { colors, radius, shadow, spacing, typography } from '../utils/theme';
import { EstadoChip, PrioridadChip } from './Chip';
import { ServicioIcon } from './ServicioIcon';

interface Props {
  solicitud: Solicitud;
  onPress: () => void;
  onDelete: () => void;
}

export function SolicitudCard({ solicitud, onPress, onDelete }: Props) {
  return (
    <View style={styles.card}>
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Solicitud de ${solicitud.mascotaNombre}`}
        style={({ pressed }) => [
          styles.cardContent,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.header}>
          <ServicioIcon tipo={solicitud.tipoServicio} />

          <View style={styles.headerText}>
            <Text style={styles.mascota} numberOfLines={1}>
              {solicitud.mascotaNombre}
            </Text>

            <Text style={styles.servicio}>
              {SERVICIO_INFO[solicitud.tipoServicio].label}
            </Text>
          </View>

          <EstadoChip estado={solicitud.estado} />
        </View>

        <Text style={styles.cliente}>
          👤 {solicitud.clienteNombre} · 📞 {solicitud.telefono}
        </Text>

        <Text style={styles.descripcion} numberOfLines={2}>
          {solicitud.descripcion}
        </Text>

        <View style={styles.footerInfo}>
          <View style={styles.footerLeft}>
            <PrioridadChip prioridad={solicitud.prioridad} />
            <Text style={styles.fecha}>
              {formatearFecha(solicitud.fechaRegistro)}
            </Text>
          </View>
        </View>
      </Pressable>

      <View style={styles.deleteRow}>
        <Pressable
          onPress={onDelete}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={`Eliminar solicitud de ${solicitud.mascotaNombre}`}
          style={({ pressed }) => [
            styles.deleteBtn,
            pressed && styles.deletePressed,
          ]}
        >
          <Text style={styles.deleteText}>🗑 Eliminar</Text>
        </Pressable>
      </View>
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

  cardContent: {
    padding: spacing.lg,
  },

  pressed: {
    opacity: 0.9,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.md,
  },

  headerText: {
    flex: 1,
  },

  mascota: {
    ...typography.subtitulo,
    color: colors.text,
  },

  servicio: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 1,
  },

  cliente: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.xs + 2,
  },

  descripcion: {
    ...typography.cuerpo,
    color: colors.text,
    marginBottom: spacing.md,
  },

  footerInfo: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },

  footerLeft: {
    gap: 6,
  },

  fecha: {
    ...typography.detalle,
    color: colors.textMuted,
  },

  deleteRow: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },

  deleteBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.dangerSoft,
  },

  deletePressed: {
    opacity: 0.6,
  },

  deleteText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.danger,
  },
});

