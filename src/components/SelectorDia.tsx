import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { mismoDia, proximosDias } from '../utils/fechas';
import { colors, radius, spacing } from '../utils/theme';

interface Props {
  selected: string;
  onSelect: (iso: string) => void;
  dias?: number;
}

export function SelectorDia({ selected, onSelect, dias = 7 }: Props) {
  const lista = React.useMemo(() => proximosDias(dias), [dias]);
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} style={styles.scroll}>
      {lista.map((d) => {
        const active = mismoDia(d.iso, selected);
        return (
          <Pressable
            key={d.iso}
            onPress={() => onSelect(d.iso)}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`${d.dia} ${d.numero} ${d.mes}`}
            style={({ pressed }) => [styles.day, active && styles.dayActive, pressed && { opacity: 0.8 }]}
          >
            <Text style={[styles.dia, active && styles.textActive]}>{d.dia}</Text>
            <Text style={[styles.numero, active && styles.textActive]}>{d.numero}</Text>
            <Text style={[styles.mes, active && styles.textActive]}>{d.mes}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  row: { gap: spacing.sm, paddingVertical: spacing.sm },
  day: {
    width: 62,
    paddingVertical: spacing.sm + 2,
    alignItems: 'center',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  dayActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  dia: { fontSize: 12, fontWeight: '700', color: colors.textMuted },
  numero: { fontSize: 20, fontWeight: '800', color: colors.text, marginVertical: 1 },
  mes: { fontSize: 11.5, color: colors.textMuted },
  textActive: { color: colors.white },
});
