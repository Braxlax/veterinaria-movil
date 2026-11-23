import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useEstadoSincronizacion } from '../hooks/useEstadoSincronizacion';
import { colors, spacing } from '../theme/theme';
import { AppIcon } from './AppIcon';

export function BannerConexion() {
  const { conectado, pendientes, usaNube } = useEstadoSincronizacion();
  const hayPendientes = usaNube && pendientes > 0;

  if (conectado && !hayPendientes) return null;

  const textoPendientes = `${pendientes} ${pendientes === 1 ? 'cambio pendiente' : 'cambios pendientes'}`;

  if (!conectado) {
    return (
      <View style={[styles.banner, { backgroundColor: colors.warningSoft }]} accessibilityRole="alert" accessibilityLiveRegion="polite">
        <AppIcon name="wifi-off" size={18} color={colors.warning} />
        <Text style={[styles.texto, { color: colors.warning }]}>
          Sin conexión. Tus cambios se guardan en el celular{hayPendientes ? ` · ${textoPendientes}` : ''}.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.banner, { backgroundColor: colors.infoSoft }]} accessibilityLiveRegion="polite">
      <ActivityIndicator size="small" color={colors.info} />
      <Text style={[styles.texto, { color: colors.info }]}>Sincronizando con la nube · {textoPendientes}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  texto: { flex: 1, fontSize: 12.5, fontWeight: '700' },
});
