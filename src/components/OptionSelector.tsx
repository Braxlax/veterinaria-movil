import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';

interface Option<T extends string> {
  value: T;
  label: string;
  icon?: string;
}

interface Props<T extends string> {
  label: string;
  options: Option<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

export function OptionSelector<T extends string>({ label, options, selected, onSelect }: Props<T>) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {options.map((op) => {
          const active = op.value === selected;
          return (
            <Pressable
              key={op.value}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onSelect(op.value)}
              style={({ pressed }) => [styles.option, active && styles.optionActive, pressed && styles.pressed]}
            >
              <Text style={[styles.text, active && styles.textActive]}>
                {op.icon ? `${op.icon} ` : ''}
                {op.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.lg },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  option: {
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  optionActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pressed: { opacity: 0.75 },
  text: { fontSize: 13.5, fontWeight: '600', color: colors.text },
  textActive: { color: colors.white },
});
