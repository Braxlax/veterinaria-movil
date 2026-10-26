import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  count: number;
}

interface Props<T extends string> {
  options: FilterOption<T>[];
  selected: T;
  onSelect: (v: T) => void;
}

export function FilterChips<T extends string>({ options, selected, onSelect }: Props<T>) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row} style={styles.scroll}>
      {options.map((o) => {
        const active = o.value === selected;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(o.value)}
            style={({ pressed }) => [styles.chip, active && styles.chipActive, pressed && { opacity: 0.75 }]}
          >
            <Text style={[styles.text, active && styles.textActive]}>
              {o.label} · {o.count}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 0 },
  row: { gap: spacing.sm, paddingVertical: spacing.md },
  chip: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  text: { fontSize: 13.5, fontWeight: '700', color: colors.text },
  textActive: { color: colors.white },
});
