import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { IconName } from '../utils/constants';
import { colors, radius, spacing } from '../utils/theme';
import { AppIcon } from './AppIcon';

interface Option<T extends string> {
  value: T;
  label: string;
  icon?: IconName;
  disabled?: boolean;
}

interface Props<T extends string> {
  label: string;
  options: Option<T>[];
  selected: T | undefined;
  onSelect: (value: T) => void;
  error?: string;
}

export function OptionSelector<T extends string>({ label, options, selected, onSelect, error }: Props<T>) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((op) => {
          const active = op.value === selected;
          return (
            <Pressable
              key={op.value}
              disabled={op.disabled}
              accessibilityRole="button"
              accessibilityState={{ selected: active, disabled: op.disabled }}
              onPress={() => onSelect(op.value)}
              style={({ pressed }) => [styles.option, active && styles.optionActive, op.disabled && styles.disabled, pressed && styles.pressed]}
            >
              {op.icon ? <AppIcon name={op.icon} size={16} color={active ? colors.white : colors.primary} /> : null}
              <Text style={[styles.text, active && styles.textActive, op.disabled && styles.textDisabled]}>{op.label}</Text>
            </Pressable>
          );
        })}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  disabled: { backgroundColor: colors.surfaceAlt, opacity: 0.6 },
  pressed: { opacity: 0.75 },
  text: { fontSize: 13.5, fontWeight: '600', color: colors.text },
  textActive: { color: colors.white },
  textDisabled: { textDecorationLine: 'line-through', color: colors.textMuted },
  error: { color: colors.danger, fontSize: 12.5, fontWeight: '600', marginTop: spacing.xs },
});
