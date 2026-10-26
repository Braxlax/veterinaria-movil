import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Mascota } from '../models/mascota';
import { ESPECIE_INFO } from '../utils/constants';
import { diasHasta } from '../utils/fechas';
import { colors, radius, shadow, spacing } from '../utils/theme';
import { AppIcon } from './AppIcon';
import { Chip } from './Chip';

export function estadoVacunacion(m: Mascota): { label: string; bg: string; fg: string } {
  const proximas = m.vacunas.filter((v) => v.proxima).map((v) => diasHasta(v.proxima as string));
  if (m.vacunas.length === 0) return { label: 'Sin vacunas', bg: colors.surfaceAlt, fg: colors.textMuted };
  if (proximas.length === 0) return { label: 'Vacunas al día', bg: colors.successSoft, fg: colors.success };
  const min = Math.min(...proximas);
  if (min < 0) return { label: 'Vacuna vencida', bg: colors.dangerSoft, fg: colors.danger };
  if (min <= 30) return { label: `Vacuna en ${min} d`, bg: colors.warningSoft, fg: colors.warning };
  return { label: 'Vacunas al día', bg: colors.successSoft, fg: colors.success };
}

export function MascotaCard({ mascota, onPress }: { mascota: Mascota; onPress: () => void }) {
  const info = ESPECIE_INFO[mascota.especie];
  const vac = estadoVacunacion(mascota);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Ficha de ${mascota.nombre}`}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.avatar}>
        <AppIcon name={info.icon} size={30} color={colors.primary} />
      </View>
      <View style={styles.body}>
        <Text style={styles.nombre}>{mascota.nombre}</Text>
        <Text style={styles.sub} numberOfLines={1}>
          {info.label} · {mascota.raza} · {mascota.edadAnios} {mascota.edadAnios === 1 ? 'año' : 'años'}
        </Text>
        <Text style={styles.dueno} numberOfLines={1}>
          Dueño: {mascota.duenoNombre}
        </Text>
        <View style={{ marginTop: spacing.sm }}>
          <Chip {...vac} />
        </View>
      </View>
      <AppIcon name="chevron-right" size={22} color={colors.textMuted} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  pressed: { backgroundColor: colors.surfaceAlt, transform: [{ scale: 0.99 }] },
  avatar: { width: 58, height: 58, borderRadius: 29, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  body: { flex: 1 },
  nombre: { fontSize: 17, fontWeight: '800', color: colors.text },
  sub: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  dueno: { fontSize: 13, color: colors.text, marginTop: 2 },
});
