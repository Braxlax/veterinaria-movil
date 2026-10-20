import { ActivityIndicator, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger';
  loading?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({ title, onPress, variant = 'primary', loading = false, style }: Props) {
  const isPrimary = variant === 'primary';
  const fg = isPrimary ? colors.white : variant === 'danger' ? colors.danger : colors.primary;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
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
      {loading ? <ActivityIndicator color={fg} /> : <Text style={[styles.text, { color: fg }]}>{title}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52, // área táctil cómoda (>= 48dp)
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  primary: { backgroundColor: '#78943B' },/*color del boton de inicion de sesion */
  outline: { borderWidth: 1.5, borderColor: colors.primary, backgroundColor: 'transparent' },
  danger: { borderWidth: 1.5, borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  pressed: { opacity: 0.8, transform: [{ scale: 0.98 }] },
  text: { fontSize: 16, fontWeight: '700' },
});
