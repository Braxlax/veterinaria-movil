import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ESTADOS, Solicitud } from '../../domain/entities/solicitud';
import { ESTADO_INFO } from '../constants/ui';
import { radius, spacing } from '../theme/theme';

export function ResumenEstados({ solicitudes }: { solicitudes: Solicitud[] }) {
  return (
    <View style={styles.row}>
      {ESTADOS.map((estado) => {
        const info = ESTADO_INFO[estado];
        const cantidad = solicitudes.filter((s) => s.estado === estado).length;
        return (
          <View key={estado} style={[styles.box, { backgroundColor: info.bg }]} accessible accessibilityLabel={`${cantidad} ${info.label}`}>
            <Text style={[styles.numero, { color: info.fg }]}>{cantidad}</Text>
            <Text style={[styles.label, { color: info.fg }]}>{info.label}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  box: { flex: 1, borderRadius: radius.md, paddingVertical: spacing.md, alignItems: 'center' },
  numero: { fontSize: 26, fontWeight: '800' },
  label: { fontSize: 12, fontWeight: '700', marginTop: 2 },
});
