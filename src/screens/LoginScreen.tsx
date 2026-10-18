import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { validarCredenciales } from '../utils/auth';
import { CLINICA_NOMBRE } from '../utils/constants';
import { colors, radius, spacing } from '../utils/theme';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);

  const handleLogin = () => {
    if (!usuario.trim() || !contrasena) {
      setError('Ingresa tu usuario y contraseña.');
      return;
    }

    if (!validarCredenciales(usuario, contrasena)) {
      setError('Usuario o contraseña incorrectos.');
      return;
    }

    setError('');
    router.replace('/solicitudes');
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingTop: insets.top + spacing.xxl, paddingBottom: insets.bottom + spacing.xxl },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoEmoji}>🐾</Text>
          </View>
          <Text style={styles.clinicName}>{CLINICA_NOMBRE}</Text>
          <Text style={styles.subtitle}>Gestión de atención veterinaria</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>¡Bienvenido!</Text>
          <Text style={styles.description}>Inicia sesión para continuar</Text>

          <FormField
            label="Usuario"
            required
            placeholder="Ingresa tu usuario"
            value={usuario}
            onChangeText={(value) => {
              setUsuario(value);
              setError('');
            }}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />

          <FormField
            label="Contraseña"
            required
            placeholder="Ingresa tu contraseña"
            value={contrasena}
            onChangeText={(value) => {
              setContrasena(value);
              setError('');
            }}
            secureTextEntry={!mostrarContrasena}
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />

          <Text
            accessibilityRole="button"
            onPress={() => setMostrarContrasena((actual) => !actual)}
            style={styles.showPassword}
          >
            {mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          </Text>

          {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}

          <PrimaryButton title="Iniciar sesión" onPress={handleLogin} style={styles.loginButton} />
          <Text style={styles.footnote}>Acceso exclusivo para el personal de la veterinaria.</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.primary },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },
  header: { alignItems: 'center', marginBottom: spacing.xxl },
  logo: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  logoEmoji: { fontSize: 46 },
  clinicName: {
    fontSize: 25,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: colors.primarySoft,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: radius.lg,
    padding: spacing.xl,
  },
  title: { color: colors.text, fontSize: 24, fontWeight: '800', textAlign: 'center' },
  description: {
    color: colors.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.xs,
    marginBottom: spacing.xl,
  },
  showPassword: {
    alignSelf: 'flex-end',
    color: colors.primaryDark,
    fontSize: 13,
    fontWeight: '600',
    marginTop: -spacing.xs,
    marginBottom: spacing.sm,
    paddingVertical: spacing.xs,
  },
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  loginButton: { marginTop: spacing.sm },
  footnote: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 18,
  },
});
