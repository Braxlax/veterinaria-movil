import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '../utils/theme';

export function EmptyState({ icon, title, message }: { icon: string; title: string; message?: string }) {
  return (
    <View style={styles.box}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', paddingVertical: spacing.xxl * 2, paddingHorizontal: spacing.xl },
  icon: { fontSize: 48, marginBottom: spacing.md },
  title: { fontSize: 17, fontWeight: '800', color: colors.text, textAlign: 'center' },
  message: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
});
