import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FormField } from '../components/FormField';
import { OptionSelector } from '../components/OptionSelector';
import { PrimaryButton } from '../components/PrimaryButton';
import { Prioridad, PRIORIDADES, TipoServicio, TIPOS_SERVICIO } from '../models/solicitud';
import { useSolicitudes } from '../store/SolicitudContext';
import { useToast } from '../store/ToastContext';
import { PRIORIDAD_INFO, SERVICIO_INFO } from '../utils/constants';
import { colors, spacing } from '../utils/theme';
import { FormErrors, FormValues, hayErrores, validarFormulario } from '../utils/validators';

export default function CrearSolicitudScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { agregarSolicitud } = useSolicitudes();

  // useState: estado local del formulario
  const [values, setValues] = useState<FormValues>({
    clienteNombre: '',
    telefono: '',
    mascotaNombre: '',
    descripcion: '',
  });
  const [tipoServicio, setTipoServicio] = useState<TipoServicio>('CONSULTA');
  const [prioridad, setPrioridad] = useState<Prioridad>('MEDIA');
  const [errors, setErrors] = useState<FormErrors>({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const setCampo = (campo: keyof FormValues) => (texto: string) => {
    const nuevos = { ...values, [campo]: texto };
    setValues(nuevos);
    // Una vez que el usuario intentó enviar, valida en vivo para limpiar los errores al corregir
    if (intentoEnvio) setErrors(validarFormulario(nuevos));
  };

  const handleGuardar = () => {
    setIntentoEnvio(true);
    const errs = validarFormulario(values);
    setErrors(errs);
    if (hayErrores(errs)) {
      toast('Revisa los campos marcados', 'error');
      return;
    }
    const nueva = agregarSolicitud({ ...values, tipoServicio, prioridad });
    toast(`Solicitud de ${nueva.mascotaNombre} registrada`, 'success');
    router.back();
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]}
        keyboardShouldPersistTaps="handled"
      >
        <FormField
          label="Nombre del cliente"
          required
          placeholder="Ej. Juan Pérez"
          value={values.clienteNombre}
          onChangeText={setCampo('clienteNombre')}
          error={errors.clienteNombre}
          autoCapitalize="words"
        />
        <FormField
          label="Teléfono"
          required
          placeholder="Ej. 987654321"
          keyboardType="phone-pad"
          maxLength={9}
          value={values.telefono}
          onChangeText={setCampo('telefono')}
          error={errors.telefono}
        />
        <FormField
          label="Nombre de la mascota"
          required
          placeholder="Ej. Bobby"
          value={values.mascotaNombre}
          onChangeText={setCampo('mascotaNombre')}
          error={errors.mascotaNombre}
          autoCapitalize="words"
        />

        <OptionSelector
          label="Tipo de servicio"
          selected={tipoServicio}
          onSelect={setTipoServicio}
          options={TIPOS_SERVICIO.map((t) => ({ value: t, label: SERVICIO_INFO[t].label, icon: SERVICIO_INFO[t].icon }))}
        />
        <OptionSelector
          label="Prioridad"
          selected={prioridad}
          onSelect={setPrioridad}
          options={PRIORIDADES.map((p) => ({ value: p, label: PRIORIDAD_INFO[p].label }))}
        />

        <FormField
          label="Descripción del motivo"
          required
          placeholder="Describe los síntomas o el servicio requerido…"
          multiline
          maxLength={300}
          value={values.descripcion}
          onChangeText={setCampo('descripcion')}
          error={errors.descripcion}
        />

        <PrimaryButton title="Registrar solicitud" onPress={handleGuardar} />
        <PrimaryButton title="Cancelar" variant="outline" onPress={() => router.back()} style={styles.cancel} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  cancel: { marginTop: spacing.md },
});
