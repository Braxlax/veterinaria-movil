import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { IconName } from '../utils/constants';
import { colors, radius, spacing } from '../utils/theme';
import { AppIcon } from './AppIcon';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  loading?: boolean;
  icon?: IconName;
  style?: ViewStyle;
}

export function PrimaryButton({ title, onPress, variant = 'primary', loading = false, icon, style }: Props) {
  const isPrimary = variant === 'primary';
  const fg = isPrimary ? colors.white : variant === 'danger' ? colors.danger : colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ busy: loading, disabled: loading }}
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isPrimary && styles.primary,
        variant === 'outline' && styles.outline,
        variant === 'danger' && styles.danger,
        pressed && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon ? <AppIcon name={icon} size={20} color={fg} /> : null}
          <Text style={[styles.text, { color: fg }]}>{title}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: radius.md,
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  primary: { backgroundColor: colors.primary },
  outline: { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: 'transparent' },
  danger: { borderWidth: 1.5, borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  text: { fontSize: 16, fontWeight: '700' },
});
