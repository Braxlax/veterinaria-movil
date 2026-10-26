import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { IconName } from '../utils/constants';
import { colors, radius, spacing } from '../utils/theme';
import { AppIcon } from './AppIcon';

export function EmptyState({ icon = 'paw', title, message }: { icon?: IconName; title: string; message?: string }) {
  return (
    <View style={styles.box}>
      <View style={styles.circle}>
        <AppIcon name={icon} size={36} color={colors.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  box: { alignItems: 'center', paddingVertical: spacing.xxl * 2, paddingHorizontal: spacing.xl },
  circle: { width: 76, height: 76, borderRadius: radius.pill, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  title: { fontSize: 17, fontWeight: '800', color: colors.text, textAlign: 'center' },
  message: { fontSize: 14, color: colors.textMuted, marginTop: spacing.xs, textAlign: 'center' },
});
