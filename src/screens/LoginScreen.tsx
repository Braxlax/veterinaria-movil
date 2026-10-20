import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormField } from '../components/FormField';
import { validarCredenciales } from '../utils/auth';
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
    router.replace('/home');
  };
  return (
    <ImageBackground source={require('../../assets/images/tabIcons/fondobienvenida.png')} resizeMode="cover">
      <View style={styles.logoImage}>
        <Image
          source={require('../../assets/images/tabIcons/mr.patitas.png')}
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
          secureTextEntry={!mostrarContrasena}
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleLogin}
          returnKeyType="done"
        />

        <Text accessibilityRole="button" onPress={() => setMostrarContrasena(actual => !actual)} style={styles.showPassword}>
          {mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        </Text>

        {error ? (
          <Text accessibilityRole="alert" style={styles.error}>
            {error}
          </Text>
        ) : null}

        <Pressable style={styles.pawButton} onPress={handleLogin}>
          <View style={styles.pawTop}>
            <View style={[styles.pawToe, styles.toe1]} />
            <View style={[styles.pawToe, styles.toe2]} />
            <View style={[styles.pawToe, styles.toe3]} />
            <View style={[styles.pawToe, styles.toe4]} />
          </View>

          <View style={styles.pawMain}>
            <Text style={styles.pawText}>Iniciar sesión</Text>
          </View>
        </Pressable>
        <Text style={styles.footnote}>Acceso exclusivo para el personal de la veterinaria.</Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: spacing.xl,
    paddingTop: 20,
    paddingBottom: spacing.xxl,
  },
  pawButton: {
    alignSelf: 'center',
    width: 220,
    height: 145,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
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
    backgroundColor: '#78943B',
  },
  /*cada huellita*/
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
    backgroundColor: '#78943B',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-2deg' }],
  },

  pawText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoImage: {
    width: 150,
    height: 150,
    borderRadius: 80,
    backgroundColor: '#FFFFFF',
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
