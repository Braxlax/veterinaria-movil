import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { registrarCuenta } from '../utils/auth';
import { colors, spacing } from '../utils/theme';

export default function RegistroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  const handleRegistro = () => {
    setError('');
    setMensajeExito('');

    if (![nombre, apellidos, correo, telefono, usuario, contrasena, confirmacion].every(v => v.trim())) {
      setError('Completa todos los campos obligatorios.'); return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim())) {
      setError('Ingresa un correo electrónico válido.'); return;
    }
    if (!/^[0-9+\s()-]{7,15}$/.test(telefono.trim())) {
      setError('Ingresa un teléfono válido (entre 7 y 15 caracteres numéricos).'); return;
    }
    if (usuario.trim().length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres.'); return;
    }
    if (contrasena.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.'); return;
    }
    if (contrasena !== confirmacion) {
      setError('Las contraseñas no coinciden.'); return;
    }

    // Los datos personales solo se validan; no se guardan.
    const resultado = registrarCuenta(usuario, contrasena);
    if (!resultado.ok) {
      setError(resultado.mensaje ?? 'No se pudo crear la cuenta.');
      return;
    }

    setMensajeExito('¡Cuenta creada exitosamente! Ya puedes iniciar sesión.');
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]} keyboardShouldPersistTaps="handled">
        <View style={styles.intro}>
          <Text style={styles.emoji}>🐾</Text>
          <Text style={styles.title}>Crear una cuenta</Text>
          <Text style={styles.subtitle}>Únete a Mr. Patitas completando tus datos.</Text>
        </View>
        <Text style={styles.section}>Datos personales</Text>
        <FormField label="Nombre" required placeholder="Ingresa tu nombre" value={nombre} onChangeText={setNombre} autoCapitalize="words" />
        <FormField label="Apellidos" required placeholder="Ingresa tus apellidos" value={apellidos} onChangeText={setApellidos} autoCapitalize="words" />
        <FormField label="Correo electrónico" required placeholder="ejemplo@correo.com" value={correo} onChangeText={setCorreo} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
        <FormField label="Teléfono" required placeholder="Ej. 987654321" value={telefono} onChangeText={setTelefono} keyboardType="phone-pad" maxLength={15} />
        <Text style={styles.section}>Credenciales de acceso</Text>
        <FormField label="Nombre de usuario" required placeholder="Mínimo 3 caracteres" value={usuario} onChangeText={setUsuario} autoCapitalize="none" autoCorrect={false} />
        <FormField label="Contraseña" required placeholder="Mínimo 8 caracteres" value={contrasena} onChangeText={setContrasena} secureTextEntry autoCapitalize="none" />
        <FormField label="Confirmar contraseña" required placeholder="Repite tu contraseña" value={confirmacion} onChangeText={setConfirmacion} secureTextEntry autoCapitalize="none" />
        {error ? <Text accessibilityRole="alert" style={styles.error}>{error}</Text> : null}
        {mensajeExito ? <Text accessibilityRole="alert" style={styles.success}>{mensajeExito}</Text> : null}
        <PrimaryButton title="Crear cuenta" onPress={handleRegistro} />
        <PrimaryButton title="Volver al inicio de sesión" variant="outline" onPress={() => router.back()} style={styles.cancel} />
        <Text style={styles.privacy}>Los datos personales solo se validan durante el registro y no se almacenan. Para crear tu cuenta se usan el nombre de usuario y la contraseña.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  intro: { alignItems: 'center', marginBottom: spacing.xl },
  emoji: { fontSize: 42, marginBottom: spacing.sm },
  title: { color: colors.text, fontSize: 25, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: spacing.xs },
  section: { color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: spacing.md, marginTop: spacing.sm },
  error: { color: colors.danger, fontSize: 13, fontWeight: '600', marginBottom: spacing.md },
  success: { color: '#347A36', fontSize: 14, fontWeight: '700', marginBottom: spacing.md },
  cancel: { marginTop: spacing.sm },
  privacy: { color: colors.textMuted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: spacing.lg },
});
