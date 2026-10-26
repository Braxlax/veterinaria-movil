import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '../components/AppIcon';
import { FormField } from '../components/FormField';
import { OptionSelector } from '../components/OptionSelector';
import { PrimaryButton } from '../components/PrimaryButton';
import { EmptyState } from '../components/EmptyState';
import { useDatosVisibles } from '../hooks/useDatosVisibles';
import { usePermisos } from '../hooks/usePermisos';
import { Prioridad, PRIORIDADES, TipoServicio, TIPOS_SERVICIO } from '../models/solicitud';
import { useAuth } from '../store/AuthContext';
import { useSolicitudes } from '../store/SolicitudContext';
import { useToast } from '../store/ToastContext';
import { PRIORIDAD_INFO, SERVICIO_INFO } from '../utils/constants';
import { colors, radius, spacing } from '../utils/theme';
import { FormErrors, FormValues, hayErrores, validarFormulario } from '../utils/validators';

const NUEVA = 'NUEVA';

export default function CrearSolicitudScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { sesion } = useAuth();
  const { agregarSolicitud } = useSolicitudes();
  const { mascotas } = useDatosVisibles();
  const { crearSolicitud } = usePermisos();
  const { mascotaId: mascotaParam, servicio } = useLocalSearchParams<{ mascotaId?: string; servicio?: string }>();

  const [values, setValues] = useState<FormValues>({
    clienteNombre: sesion?.rol === 'cliente' ? `${sesion.nombre} ${sesion.apellidos}` : '',
    telefono: sesion?.rol === 'cliente' ? sesion.telefono : '',
    mascotaNombre: '',
    descripcion: '',
  });
  const [mascotaSel, setMascotaSel] = useState<string>(NUEVA);
  const [tipoServicio, setTipoServicio] = useState<TipoServicio>(
    TIPOS_SERVICIO.includes(servicio as TipoServicio) ? (servicio as TipoServicio) : 'CONSULTA'
  );
  const [prioridad, setPrioridad] = useState<Prioridad>('MEDIA');
  const [errors, setErrors] = useState<FormErrors>({});
  const [intentoEnvio, setIntentoEnvio] = useState(false);

  const elegirMascota = (id: string) => {
    setMascotaSel(id);
    const m = mascotas.find((x) => x.id === id);
    if (m) {
      setValues((v) => ({ ...v, clienteNombre: m.duenoNombre, telefono: m.duenoTelefono, mascotaNombre: m.nombre }));
      setErrors({});
    }
  };

  useEffect(() => {
    if (mascotaParam && mascotas.some((m) => m.id === mascotaParam)) elegirMascota(mascotaParam);
  }, [mascotaParam]);

  const setCampo = (campo: keyof FormValues) => (texto: string) => {
    const nuevos = { ...values, [campo]: texto };
    setValues(nuevos);
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
    const nueva = agregarSolicitud({
      ...values,
      tipoServicio,
      prioridad: tipoServicio === 'EMERGENCIA' ? 'ALTA' : prioridad,
      mascotaId: mascotaSel === NUEVA ? undefined : mascotaSel,
      creadoPor: sesion?.usuario,
    });
    toast(`Solicitud de ${nueva.mascotaNombre} registrada`, 'success');
    router.back();
  };

  if (!crearSolicitud) {
    return <EmptyState icon="lock" title="Sin permiso" message="Tu perfil no permite registrar solicitudes." />;
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]} keyboardShouldPersistTaps="handled">
        {mascotas.length > 0 ? (
          <OptionSelector
            label="¿Para qué mascota?"
            selected={mascotaSel}
            onSelect={elegirMascota}
            options={[
              ...mascotas.map((m) => ({ value: m.id, label: m.nombre, icon: 'paw' as const })),
              { value: NUEVA, label: 'Otra mascota' },
            ]}
          />
        ) : null}

        <FormField label="Nombre del cliente" required placeholder="Ej. Juan Pérez" value={values.clienteNombre} onChangeText={setCampo('clienteNombre')} error={errors.clienteNombre} autoCapitalize="words" />
        <FormField label="Teléfono" required placeholder="Ej. 987654321" keyboardType="phone-pad" maxLength={9} value={values.telefono} onChangeText={setCampo('telefono')} error={errors.telefono} />
        <FormField label="Nombre de la mascota" required placeholder="Ej. Bobby" value={values.mascotaNombre} onChangeText={setCampo('mascotaNombre')} error={errors.mascotaNombre} autoCapitalize="words" />

        <OptionSelector
          label="Tipo de servicio"
          selected={tipoServicio}
          onSelect={setTipoServicio}
          options={TIPOS_SERVICIO.map((t) => ({ value: t, label: SERVICIO_INFO[t].label, icon: SERVICIO_INFO[t].icon }))}
        />

        {tipoServicio === 'EMERGENCIA' ? (
          <View style={styles.aviso}>
            <AppIcon name="alert-circle" size={20} color={colors.danger} />
            <Text style={styles.avisoTexto}>Las emergencias se registran con prioridad alta. Si es grave, llama a la clínica de inmediato.</Text>
          </View>
        ) : (
          <OptionSelector
            label="Prioridad"
            selected={prioridad}
            onSelect={setPrioridad}
            options={PRIORIDADES.map((p) => ({ value: p, label: PRIORIDAD_INFO[p].label }))}
          />
        )}

        <FormField
          label="Descripción del motivo"
          required
          placeholder="Cuéntanos qué le pasa a tu mascota (mín. 10 caracteres)"
          multiline
          maxLength={300}
          value={values.descripcion}
          onChangeText={setCampo('descripcion')}
          error={errors.descripcion}
        />

        <View style={styles.fechaRow}>
          <AppIcon name="clock-outline" size={18} color={colors.textMuted} />
          <Text style={styles.fechaTexto}>La fecha y hora de registro se asignan automáticamente al guardar.</Text>
        </View>

        <PrimaryButton title="Registrar solicitud" icon="check" onPress={handleGuardar} />
        <PrimaryButton title="Cancelar" variant="outline" onPress={() => router.back()} style={{ marginTop: spacing.sm }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  aviso: { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', backgroundColor: colors.dangerSoft, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  avisoTexto: { flex: 1, color: colors.danger, fontSize: 13, fontWeight: '600' },
  fechaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  fechaTexto: { flex: 1, color: colors.textMuted, fontSize: 12.5 },
});
