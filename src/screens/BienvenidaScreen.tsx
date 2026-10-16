import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PrimaryButton } from '../components/PrimaryButton';
import { CLINICA_NOMBRE, SERVICIO_INFO } from '../utils/constants';
import { colors, radius, spacing } from '../utils/theme';
import { TIPOS_SERVICIO } from '../models/solicitud';

export default function BienvenidaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xl }]}>
      <View style={styles.hero}>
        <View style={styles.logo}>
          <Text style={styles.logoEmoji}>🐾</Text>
        </View>
        <Text style={styles.title}>{CLINICA_NOMBRE}</Text>
        <Text style={styles.subtitle}>Gestión de solicitudes de atención</Text>

        <View style={styles.services}>
          {TIPOS_SERVICIO.map((t) => (
            <View key={t} style={styles.service}>
              <View style={[styles.serviceIcon, { backgroundColor: SERVICIO_INFO[t].color }]}>
                <Text style={styles.serviceEmoji}>{SERVICIO_INFO[t].icon}</Text>
              </View>
              <Text style={styles.serviceLabel}>{SERVICIO_INFO[t].label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View>
        <Text style={styles.hint}>
          Registra, consulta y actualiza las solicitudes de tus clientes en un solo lugar.
        </Text>
        <PrimaryButton title="Ingresar" onPress={() => router.replace('/solicitudes')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, paddingHorizontal: spacing.xl, justifyContent: 'space-between' },
  hero: { alignItems: 'center', marginTop: spacing.xxl },
  logo: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  logoEmoji: { fontSize: 54 },
  title: { fontSize: 28, fontWeight: '800', color: colors.white, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.primarySoft, marginTop: spacing.sm, textAlign: 'center' },
  services: { flexDirection: 'row', gap: spacing.lg, marginTop: spacing.xxl * 1.5 },
  service: { alignItems: 'center', gap: spacing.sm },
  serviceIcon: { width: 56, height: 56, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center' },
  serviceEmoji: { fontSize: 26 },
  serviceLabel: { fontSize: 11.5, color: colors.primarySoft, fontWeight: '600' },
  hint: { color: colors.primarySoft, textAlign: 'center', marginBottom: spacing.lg, fontSize: 14, lineHeight: 20 },
});
