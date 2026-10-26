import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../utils/theme';

export function Avatar({ texto, size = 56 }: { texto: string; size?: number }) {
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.text, { fontSize: size * 0.38 }]}>{texto}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  text: { color: colors.white, fontWeight: '800' },
});
