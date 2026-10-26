import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../utils/theme';

export function SectionHeader({ titulo, accion, onAccion }: { titulo: string; accion?: string; onAccion?: () => void }) {
  return (
    <View style={styles.row}>
      <Text style={styles.titulo} accessibilityRole="header">
        {titulo}
      </Text>
      {accion && onAccion ? (
        <Pressable onPress={onAccion} hitSlop={8} accessibilityRole="button">
          <Text style={styles.accion}>{accion}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing.lg, marginBottom: spacing.sm },
  titulo: { fontSize: 17, fontWeight: '800', color: colors.text },
  accion: { fontSize: 13.5, fontWeight: '700', color: colors.primary },
});
