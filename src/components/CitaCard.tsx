import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Cita } from '../models/cita';
import { SERVICIO_INFO } from '../utils/constants';
import { formatearHora } from '../utils/fechas';
import { colors, radius, shadow, spacing } from '../utils/theme';
import { AppIcon } from './AppIcon';
import { EstadoCitaChip } from './Chip';
import { ServicioIcon } from './ServicioIcon';

interface Props {
  cita: Cita;
  onCompletar?: () => void;
  onCancelar?: () => void;
  mostrarDia?: boolean;
}

export function CitaCard({ cita, onCompletar, onCancelar }: Props) {
  const programada = cita.estado === 'PROGRAMADA';
  return (
    <View style={[styles.card, !programada && styles.apagada]}>
      <View style={styles.hora}>
        <Text style={styles.horaTexto}>{formatearHora(cita.fechaHora)}</Text>
      </View>
      <View style={styles.body}>
        <View style={styles.top}>
          <ServicioIcon tipo={cita.tipoServicio} size={38} />
          <View style={{ flex: 1 }}>
            <Text style={styles.mascota} numberOfLines={1}>
              {cita.mascotaNombre}
            </Text>
            <Text style={styles.sub}>{SERVICIO_INFO[cita.tipoServicio].label}</Text>
          </View>
          <EstadoCitaChip estado={cita.estado} />
        </View>
        <View style={styles.vet}>
          <AppIcon name="stethoscope" size={15} color={colors.textMuted} />
          <Text style={styles.vetText}>{cita.veterinario}</Text>
        </View>
        <Text style={styles.motivo} numberOfLines={2}>
          {cita.motivo}
        </Text>

        {programada && (onCompletar || onCancelar) ? (
          <View style={styles.actions}>
            {onCompletar ? (
              <Pressable onPress={onCompletar} accessibilityRole="button" style={({ pressed }) => [styles.btn, styles.btnOk, pressed && { opacity: 0.7 }]}>
                <AppIcon name="check" size={16} color={colors.success} />
                <Text style={[styles.btnText, { color: colors.success }]}>Completar</Text>
              </Pressable>
            ) : null}
            {onCancelar ? (
              <Pressable onPress={onCancelar} accessibilityRole="button" style={({ pressed }) => [styles.btn, styles.btnCancel, pressed && { opacity: 0.7 }]}>
                <AppIcon name="cancel" size={16} color={colors.danger} />
                <Text style={[styles.btnText, { color: colors.danger }]}>Cancelar</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadow.card,
  },
  apagada: { opacity: 0.7 },
  hora: { width: 64, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  horaTexto: { fontSize: 16, fontWeight: '800', color: colors.primaryDark },
  body: { flex: 1, padding: spacing.md },
  top: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  mascota: { fontSize: 16, fontWeight: '800', color: colors.text },
  sub: { fontSize: 12.5, color: colors.textMuted },
  vet: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: spacing.sm },
  vetText: { fontSize: 13, color: colors.textMuted },
  motivo: { fontSize: 13.5, color: colors.text, marginTop: 4 },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.sm },
  btnOk: { backgroundColor: colors.successSoft },
  btnCancel: { backgroundColor: colors.dangerSoft },
  btnText: { fontSize: 13, fontWeight: '700' },
});
