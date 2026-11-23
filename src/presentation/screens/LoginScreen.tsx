import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormField } from '../components/FormField';
import { useAuth } from '../store/AuthContext';
import { colors, radius, spacing } from '../theme/theme';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { iniciarSesion } = useAuth();
  const [cargando, setCargando] = useState(false);
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (cargando) return;
    if (!usuario.trim() || !contrasena) {
      setError('Ingresa tu usuario y contraseña.');
      return;
    }

    setCargando(true);
    setError('');

    let resultado;
    try {
      resultado = await iniciarSesion(usuario, contrasena);
    } catch {
      resultado = { ok: false as const, mensaje: 'No se pudo iniciar sesión. Inténtalo nuevamente.' };
    } finally {
      setCargando(false);
    }

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }
    setError('');
  };

  return (
    <ImageBackground source={require('../../../assets/images/tabIcons/fondobienvenida.png')} resizeMode="cover" style={styles.background}>
      <ScrollView
        bounces={false}
        contentContainerStyle={[styles.container, { paddingTop: 20 + insets.top, paddingBottom: spacing.xl + insets.bottom }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.logoImage}>
          <Image
            source={require('../../../assets/images/tabIcons/mr.patitas.png')}
            style={{
              width: 180,
              height: 180,
            }}
            resizeMode="contain"
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>¡Bienvenido!</Text>
          <Text style={styles.description}>Inicia sesión para continuar</Text>

          <FormField
            label="Usuario"
            required
            placeholder="Ingresa tu usuario"
            value={usuario}
            onChangeText={value => {
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
            onChangeText={value => {
              setContrasena(value);
              setError('');
            }}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />

          {error ? (
            <Text accessibilityRole="alert" style={styles.error}>
              {error}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={cargando ? 'Iniciando sesión' : 'Iniciar sesión'}
            accessibilityState={{ busy: cargando, disabled: cargando }}
            disabled={cargando}
            style={[styles.pawButton, cargando && styles.pawButtonDisabled]}
            onPress={handleLogin}
          >
            <View style={styles.pawTop}>
              <View style={[styles.pawToe, styles.toe1]} />
              <View style={[styles.pawToe, styles.toe2]} />
              <View style={[styles.pawToe, styles.toe3]} />
              <View style={[styles.pawToe, styles.toe4]} />
            </View>

            <View style={styles.pawMain}>
              <Text style={styles.pawText}>{cargando ? 'Ingresando...' : 'Iniciar sesión'}</Text>
            </View>
          </Pressable>
          <Text style={styles.footnote}>Acceso exclusivo para el personal de la veterinaria.</Text>
          <Text accessibilityRole="button" onPress={() => router.push('/registro')} style={styles.registerLink}>
            ¿No tienes cuenta? Regístrate
          </Text>
          <Text style={styles.demo}>Demo: admin / patitas123 · usuario / usuario123</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.xl,
  },
  pawButton: {
    alignSelf: 'center',
    width: 220,
    height: 145,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  pawButtonDisabled: {
    opacity: 0.65,
  },

  pawTop: {
    width: 150,
    height: 48,
    position: 'relative',
    marginBottom: -2,
  },

  pawToe: {
    position: 'absolute',
    width: 34,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.brand,
  },

  toe1: {
    left: -30,
    top: 10,
    transform: [{ rotate: '-25deg' }],
  },

  toe2: {
    left: 22,
    top: 0,
    transform: [{ rotate: '-8deg' }],
  },

  toe3: {
    left: 80,
    top: 0,
    transform: [{ rotate: '8deg' }],
  },

  toe4: {
    left: 145,
    top: 8,
    transform: [{ rotate: '25deg' }],
  },

  pawMain: {
    width: 170,
    height: 70,
    borderRadius: 40,
    backgroundColor: colors.brand,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-2deg' }],
  },

  pawText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoImage: {
    width: 150,
    height: 150,
    borderRadius: 80,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 85,
    marginBottom: 20,
  },
  images: {
    width: 150,
    height: 150,
    borderRadius: 55,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    overflow: 'hidden',
  },
  subtitle: {
    fontSize: 14,
    color: colors.primarySoft,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  card: {
    marginTop: 0,
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
  error: {
    color: colors.danger,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.md,
  },
  loginButton: { marginTop: spacing.sm },
  registerLink: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: spacing.md,
    paddingVertical: spacing.xs,
  },
  demo: { color: colors.textMuted, fontSize: 11, textAlign: 'center', marginTop: spacing.sm },
  footnote: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: 'center',
    marginTop: spacing.lg,
    lineHeight: 18,
  },
});
