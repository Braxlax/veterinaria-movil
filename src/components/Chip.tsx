import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { EstadoCita } from '../models/cita';
import { EstadoSolicitud, Prioridad } from '../models/solicitud';
import { ESTADO_CITA_INFO, ESTADO_INFO, PRIORIDAD_INFO } from '../utils/constants';
import { radius, spacing } from '../utils/theme';

interface BaseProps {
  label: string;
  bg: string;
  fg: string;
}

export function Chip({ label, bg, fg }: BaseProps) {
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <View style={[styles.dot, { backgroundColor: fg }]} />
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

export const EstadoChip = ({ estado }: { estado: EstadoSolicitud }) => <Chip {...ESTADO_INFO[estado]} />;
export const EstadoCitaChip = ({ estado }: { estado: EstadoCita }) => <Chip {...ESTADO_CITA_INFO[estado]} />;

export const PrioridadChip = ({ prioridad }: { prioridad: Prioridad }) => (
  <Chip {...PRIORIDAD_INFO[prioridad]} label={`Prioridad ${PRIORIDAD_INFO[prioridad].label.toLowerCase()}`} />
);

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 4,
    borderRadius: radius.pill,
    gap: 6,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 12, fontWeight: '700' },
});
