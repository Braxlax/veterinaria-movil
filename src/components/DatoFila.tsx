import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconName } from '../utils/constants';
import { colors, spacing } from '../utils/theme';
import { AppIcon } from './AppIcon';

export function DatoFila({ icon, label, value }: { icon: IconName; label: string; value: string }) {
  return (
    <View style={styles.row}>
      <AppIcon name={icon} size={18} color={colors.primary} />
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 6 },
  label: { fontSize: 13.5, color: colors.textMuted, width: 86 },
  value: { flex: 1, fontSize: 14, fontWeight: '600', color: colors.text, textAlign: 'right' },
});
