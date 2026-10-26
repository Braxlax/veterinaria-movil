import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconName } from '../utils/constants';
import { colors, radius, shadow, spacing } from '../utils/theme';
import { AppIcon } from './AppIcon';

export function Fab({ label, onPress, icon = 'plus' }: { label: string; onPress: () => void; icon?: IconName }) {
  const insets = useSafeAreaInsets();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.fab, { bottom: spacing.lg + Math.min(insets.bottom, 8) }, pressed && styles.pressed]}
    >
      <AppIcon name={icon} size={22} color={colors.white} />
      <Text style={styles.text}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg + 2,
    height: 54,
    borderRadius: radius.pill,
    ...shadow.card,
    shadowOpacity: 0.25,
    elevation: 6,
  },
  pressed: { transform: [{ scale: 0.96 }], opacity: 0.92 },
  text: { color: colors.white, fontSize: 15, fontWeight: '800' },
});
