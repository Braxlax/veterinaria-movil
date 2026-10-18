import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';

interface Props {
  value: string;
  onChangeText: (t: string) => void;
}

export function SearchBar({ value, onChangeText }: Props) {
  return (
    <View style={styles.box}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar por mascota, cliente o teléfono"
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        autoCorrect={false}
        returnKeyType="search"
        accessibilityLabel="Buscar solicitudes"
      />
      {value.length > 0 && (
        <Pressable onPress={() => onChangeText('')} hitSlop={10} accessibilityLabel="Limpiar búsqueda">
          <Text style={styles.clear}>✕</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
  },
  icon: { fontSize: 15, marginRight: spacing.sm },
  input: { flex: 1, paddingVertical: spacing.md, fontSize: 15, color: colors.text },
  clear: { fontSize: 16, color: colors.textMuted, paddingHorizontal: spacing.xs },
});
