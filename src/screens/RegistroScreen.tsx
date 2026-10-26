import { useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '../components/AppIcon';
import { FormField } from '../components/FormField';
import { PrimaryButton } from '../components/PrimaryButton';
import { useAuth } from '../store/AuthContext';
import { useToast } from '../store/ToastContext';
import {
  hayErrores,
  validarContrasena,
  validarCorreo,
  validarNombre,
  validarTelefono,
  validarUsuario,
} from '../utils/validators';
import { colors, spacing } from '../utils/theme';

type Campos = 'nombre' | 'apellidos' | 'correo' | 'telefono' | 'usuario' | 'contrasena' | 'confirmacion';
type Valores = Record<Campos, string>;
type Errores = Partial<Record<Campos | 'general', string>>;

const VACIO: Valores = { nombre: '', apellidos: '', correo: '', telefono: '', usuario: '', contrasena: '', confirmacion: '' };

const validar = (v: Valores): Errores => ({
  nombre: validarNombre(v.nombre, 'El nombre'),
  apellidos: validarNombre(v.apellidos, 'Los apellidos'),
  correo: validarCorreo(v.correo),
  telefono: validarTelefono(v.telefono),
  usuario: validarUsuario(v.usuario),
  contrasena: validarContrasena(v.contrasena),
  confirmacion: v.confirmacion !== v.contrasena ? 'Las contraseñas no coinciden.' : v.confirmacion ? undefined : 'Confirma tu contraseña.',
});

export default function RegistroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { registrarCuenta } = useAuth();

  const [valores, setValores] = useState<Valores>(VACIO);
  const [errores, setErrores] = useState<Errores>({});
  const [intento, setIntento] = useState(false);
  const [cargando, setCargando] = useState(false);

  const setCampo = (campo: Campos) => (texto: string) => {
    const nuevos = { ...valores, [campo]: texto };
    setValores(nuevos);
    if (intento) setErrores(validar(nuevos));
  };

  const handleRegistro = async () => {
    setIntento(true);
    const errs = validar(valores);
    setErrores(errs);
    if (hayErrores(errs)) {
      toast('Revisa los campos marcados', 'error');
      return;
    }
    setCargando(true);
    const res = await registrarCuenta({
      nombre: valores.nombre,
      apellidos: valores.apellidos,
      correo: valores.correo,
      telefono: valores.telefono,
      usuario: valores.usuario,
      contrasena: valores.contrasena,
    });
    setCargando(false);
    if (!res.ok) {
      setErrores({ usuario: res.mensaje });
      toast(res.mensaje, 'error');
      return;
    }
    toast('¡Cuenta creada! Ya puedes iniciar sesión', 'success');
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]} keyboardShouldPersistTaps="handled">
        <View style={styles.intro}>
          <View style={styles.iconCircle}>
            <AppIcon name="paw" size={34} color={colors.white} />
          </View>
          <Text style={styles.title}>Crear una cuenta</Text>
          <Text style={styles.subtitle}>Registra a tus mascotas, pide citas y consulta su historial desde el celular.</Text>
        </View>

        <Text style={styles.section}>Datos personales</Text>
        <FormField label="Nombre" required placeholder="Ej. Ana" value={valores.nombre} error={errores.nombre} onChangeText={setCampo('nombre')} autoCapitalize="words" />
        <FormField label="Apellidos" required placeholder="Ej. Torres Díaz" value={valores.apellidos} error={errores.apellidos} onChangeText={setCampo('apellidos')} autoCapitalize="words" />
        <FormField label="Correo electrónico" required placeholder="ejemplo@correo.com" value={valores.correo} error={errores.correo} onChangeText={setCampo('correo')} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
        <FormField label="Teléfono" required placeholder="Ej. 987654321" value={valores.telefono} error={errores.telefono} onChangeText={setCampo('telefono')} keyboardType="phone-pad" maxLength={9} />

        <Text style={styles.section}>Credenciales de acceso</Text>
        <FormField label="Nombre de usuario" required placeholder="Mínimo 3 caracteres" value={valores.usuario} error={errores.usuario} onChangeText={setCampo('usuario')} autoCapitalize="none" autoCorrect={false} />
        <FormField label="Contraseña" required placeholder="Mínimo 8 caracteres" value={valores.contrasena} error={errores.contrasena} onChangeText={setCampo('contrasena')} secureTextEntry autoCapitalize="none" />
        <FormField label="Confirmar contraseña" required placeholder="Repite tu contraseña" value={valores.confirmacion} error={errores.confirmacion} onChangeText={setCampo('confirmacion')} secureTextEntry autoCapitalize="none" />

        <PrimaryButton title="Crear cuenta" icon="account-plus" loading={cargando} onPress={handleRegistro} style={{ marginTop: spacing.sm }} />
        <PrimaryButton title="Volver al inicio de sesión" variant="outline" onPress={() => router.back()} style={{ marginTop: spacing.sm }} />
        <Text style={styles.privacy}>Las cuentas nuevas tienen rol Cliente. La información se guarda solo en la memoria de la app durante esta demostración.</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  intro: { alignItems: 'center', marginBottom: spacing.lg },
  iconCircle: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  title: { color: colors.text, fontSize: 25, fontWeight: '800' },
  subtitle: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginTop: spacing.xs },
  section: { color: colors.text, fontSize: 17, fontWeight: '800', marginBottom: spacing.md, marginTop: spacing.sm },
  privacy: { color: colors.textMuted, fontSize: 12, lineHeight: 18, textAlign: 'center', marginTop: spacing.lg },
});
