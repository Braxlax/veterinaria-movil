import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { FormField } from '../components/FormField';
import { OptionSelector } from '../components/OptionSelector';
import { PrimaryButton } from '../components/PrimaryButton';
import { Especie, ESPECIES } from '../models/mascota';
import { useAuth } from '../store/AuthContext';
import { useMascotas } from '../store/MascotaContext';
import { useToast } from '../store/ToastContext';
import { ESPECIE_INFO } from '../utils/constants';
import { colors, spacing } from '../utils/theme';
import { hayErrores, validarNombre, validarNumero, validarTelefono } from '../utils/validators';

type Campos = 'nombre' | 'raza' | 'edad' | 'peso' | 'duenoNombre' | 'duenoTelefono';
type Errores = Partial<Record<Campos, string>>;

const validar = (v: Record<Campos, string>): Errores => ({
  nombre: validarNombre(v.nombre, 'El nombre de la mascota'),
  raza: v.raza.trim().length < 2 ? 'Indica la raza (o "Mestizo").' : undefined,
  edad: validarNumero(v.edad, 'La edad', 0, 40),
  peso: validarNumero(v.peso, 'El peso', 0.01, 120),
  duenoNombre: validarNombre(v.duenoNombre, 'El nombre del dueño'),
  duenoTelefono: validarTelefono(v.duenoTelefono),
});

export default function MascotaFormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { sesion } = useAuth();
  const { obtenerMascota, agregarMascota, actualizarMascota } = useMascotas();

  const existente = id ? obtenerMascota(id) : undefined;
  const esCliente = sesion?.rol === 'cliente';

  const [valores, setValores] = useState<Record<Campos, string>>({
    nombre: existente?.nombre ?? '',
    raza: existente?.raza ?? '',
    edad: existente ? String(existente.edadAnios) : '',
    peso: existente ? String(existente.pesoKg) : '',
    duenoNombre: existente?.duenoNombre ?? (esCliente && sesion ? `${sesion.nombre} ${sesion.apellidos}` : ''),
    duenoTelefono: existente?.duenoTelefono ?? (esCliente && sesion ? sesion.telefono : ''),
  });
  const [especie, setEspecie] = useState<Especie>(existente?.especie ?? 'PERRO');
  const [alergias, setAlergias] = useState(existente?.alergias === 'Ninguna conocida' ? '' : (existente?.alergias ?? ''));
  const [errores, setErrores] = useState<Errores>({});
  const [intento, setIntento] = useState(false);

  if (id && !existente) return <EmptyState icon="paw" title="Mascota no encontrada" message="Es posible que haya sido eliminada." />;

  const setCampo = (campo: Campos) => (texto: string) => {
    const nuevos = { ...valores, [campo]: texto };
    setValores(nuevos);
    if (intento) setErrores(validar(nuevos));
  };

  const handleGuardar = () => {
    setIntento(true);
    const errs = validar(valores);
    setErrores(errs);
    if (hayErrores(errs)) {
      toast('Revisa los campos marcados', 'error');
      return;
    }
    const datos = {
      nombre: valores.nombre.trim(),
      especie,
      raza: valores.raza.trim(),
      edadAnios: Number(valores.edad.replace(',', '.')),
      pesoKg: Number(valores.peso.replace(',', '.')),
      duenoNombre: valores.duenoNombre.trim(),
      duenoTelefono: valores.duenoTelefono.trim(),
      alergias: alergias.trim() || 'Ninguna conocida',
    };
    if (existente) {
      actualizarMascota(existente.id, datos);
      toast(`Ficha de ${datos.nombre} actualizada`, 'success');
    } else {
      agregarMascota({ ...datos, duenoUsuario: esCliente ? sesion?.usuario : undefined });
      toast(`${datos.nombre} fue registrada`, 'success');
    }
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: existente ? 'Editar mascota' : 'Nueva mascota' }} />
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]} keyboardShouldPersistTaps="handled">
        <FormField label="Nombre de la mascota" required placeholder="Ej. Bobby" value={valores.nombre} error={errores.nombre} onChangeText={setCampo('nombre')} autoCapitalize="words" />
        <OptionSelector label="Especie" selected={especie} onSelect={setEspecie} options={ESPECIES.map((e) => ({ value: e, label: ESPECIE_INFO[e].label, icon: ESPECIE_INFO[e].icon }))} />
        <FormField label="Raza" required placeholder="Ej. Labrador o Mestizo" value={valores.raza} error={errores.raza} onChangeText={setCampo('raza')} autoCapitalize="words" />
        <FormField label="Edad (años)" required placeholder="Ej. 3" keyboardType="decimal-pad" maxLength={5} value={valores.edad} error={errores.edad} onChangeText={setCampo('edad')} />
        <FormField label="Peso (kg)" required placeholder="Ej. 12.5" keyboardType="decimal-pad" maxLength={6} value={valores.peso} error={errores.peso} onChangeText={setCampo('peso')} />
        <FormField label="Nombre del dueño" required placeholder="Ej. Juan Pérez" value={valores.duenoNombre} error={errores.duenoNombre} onChangeText={setCampo('duenoNombre')} autoCapitalize="words" />
        <FormField label="Teléfono del dueño" required placeholder="Ej. 987654321" keyboardType="phone-pad" maxLength={9} value={valores.duenoTelefono} error={errores.duenoTelefono} onChangeText={setCampo('duenoTelefono')} />
        <FormField label="Alergias o condiciones" placeholder="Opcional. Ej. Alergia al pollo" value={alergias} onChangeText={setAlergias} />

        <PrimaryButton title={existente ? 'Guardar cambios' : 'Registrar mascota'} icon="check" onPress={handleGuardar} style={{ marginTop: spacing.sm }} />
        <PrimaryButton title="Cancelar" variant="outline" onPress={() => router.back()} style={{ marginTop: spacing.sm }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
});
