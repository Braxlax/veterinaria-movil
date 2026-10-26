import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';
import { AppIcon } from './AppIcon';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChangeText, placeholder = 'Buscar por mascota, cliente o teléfono' }: Props) {
  return (
    <View style={styles.box}>
      <AppIcon name="magnify" size={20} color={colors.textMuted} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel={placeholder}
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityRole="button" accessibilityLabel="Limpiar búsqueda">
          <AppIcon name="close" size={18} color={colors.textMuted} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  input: { flex: 1, paddingVertical: spacing.md, fontSize: 15, color: colors.text },
});
