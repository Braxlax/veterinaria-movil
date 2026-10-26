import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { FormField } from '../components/FormField';
import { OptionSelector } from '../components/OptionSelector';
import { PrimaryButton } from '../components/PrimaryButton';
import { SelectorDia } from '../components/SelectorDia';
import { useDatosVisibles } from '../hooks/useDatosVisibles';
import { TipoServicio, TIPOS_SERVICIO } from '../models/solicitud';
import { useAuth } from '../store/AuthContext';
import { useCitas } from '../store/CitaContext';
import { useToast } from '../store/ToastContext';
import { HORARIOS, SERVICIO_INFO, VETERINARIOS } from '../utils/constants';
import { combinarFechaHora, enDias, formatearDiaCorto } from '../utils/fechas';
import { colors, spacing } from '../utils/theme';
import { validarDescripcion } from '../utils/validators';

export default function CitaNuevaScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { sesion } = useAuth();
  const { agendarCita, horarioOcupado } = useCitas();
  const { mascotas } = useDatosVisibles();
  const { mascotaId, servicio } = useLocalSearchParams<{ mascotaId?: string; servicio?: string }>();

  const [mascotaSel, setMascotaSel] = useState<string | undefined>(mascotas.some((m) => m.id === mascotaId) ? mascotaId : undefined);
  const [tipo, setTipo] = useState<TipoServicio>(TIPOS_SERVICIO.includes(servicio as TipoServicio) ? (servicio as TipoServicio) : 'CONSULTA');
  const [dia, setDia] = useState<string>(enDias(0, 0));
  const [hora, setHora] = useState<string | undefined>();
  const [vet, setVet] = useState<string>(VETERINARIOS[0]);
  const [motivo, setMotivo] = useState('');
  const [errores, setErrores] = useState<{ mascota?: string; hora?: string; motivo?: string }>({});

  const noDisponible = useMemo(() => {
    const mapa: Record<string, boolean> = {};
    HORARIOS.forEach((h) => {
      const iso = combinarFechaHora(dia, h);
      mapa[h] = new Date(iso).getTime() < Date.now() || horarioOcupado(vet, iso);
    });
    return mapa;
  }, [dia, vet, horarioOcupado]);

  const cambiarDia = (iso: string) => {
    setDia(iso);
    setHora(undefined);
  };
  const cambiarVet = (v: string) => {
    setVet(v);
    setHora(undefined);
  };

  const validar = () => ({
    mascota: mascotaSel ? undefined : 'Elige la mascota que será atendida.',
    hora: hora ? undefined : 'Elige un horario disponible.',
    motivo: validarDescripcion(motivo, 'El motivo'),
  });

  const handleAgendar = () => {
    const errs = validar();
    setErrores(errs);
    if (errs.mascota || errs.hora || errs.motivo) {
      toast('Revisa los campos marcados', 'error');
      return;
    }
    const m = mascotas.find((x) => x.id === mascotaSel);
    if (!m || !hora) return;
    const fechaHora = combinarFechaHora(dia, hora);

    if (horarioOcupado(vet, fechaHora)) {
      setErrores({ hora: 'Ese horario acaba de ocuparse. Elige otro.' });
      toast('Horario no disponible', 'error');
      return;
    }
    agendarCita({
      mascotaId: m.id,
      mascotaNombre: m.nombre,
      duenoUsuario: m.duenoUsuario,
      tipoServicio: tipo,
      fechaHora,
      veterinario: vet,
      motivo,
      creadoPor: sesion?.usuario ?? '',
    });
    toast(`Cita de ${m.nombre} agendada para ${formatearDiaCorto(fechaHora)} ${hora}`, 'success');
    router.back();
  };

  if (mascotas.length === 0) {
    return (
      <EmptyState
        icon="paw"
        title="Primero registra una mascota"
        message="Para agendar una cita necesitas al menos una mascota registrada."
      />
    );
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]} keyboardShouldPersistTaps="handled">
        <OptionSelector
          label="Mascota"
          selected={mascotaSel}
          onSelect={(id) => {
            setMascotaSel(id);
            setErrores((e) => ({ ...e, mascota: undefined }));
          }}
          options={mascotas.map((m) => ({ value: m.id, label: m.nombre, icon: 'paw' as const }))}
          error={errores.mascota}
        />
        <OptionSelector
          label="Servicio"
          selected={tipo}
          onSelect={setTipo}
          options={TIPOS_SERVICIO.map((t) => ({ value: t, label: SERVICIO_INFO[t].label, icon: SERVICIO_INFO[t].icon }))}
        />
        <OptionSelector label="Veterinario" selected={vet} onSelect={cambiarVet} options={VETERINARIOS.map((v) => ({ value: v, label: v, icon: 'stethoscope' as const }))} />

        <Text style={styles.label}>Día</Text>
        <SelectorDia selected={dia} onSelect={cambiarDia} dias={10} />

        <OptionSelector
          label="Horario"
          selected={hora}
          onSelect={(h) => {
            setHora(h);
            setErrores((e) => ({ ...e, hora: undefined }));
          }}
          options={HORARIOS.map((h) => ({ value: h, label: h, disabled: noDisponible[h] }))}
          error={errores.hora}
        />
        <Text style={styles.nota}>Los horarios tachados ya pasaron o están ocupados para {vet}.</Text>

        <FormField
          label="Motivo de la cita"
          required
          multiline
          maxLength={300}
          placeholder="Ej. Refuerzo de vacuna y control de peso"
          value={motivo}
          error={errores.motivo}
          onChangeText={(t) => {
            setMotivo(t);
            if (errores.motivo) setErrores((e) => ({ ...e, motivo: validarDescripcion(t, 'El motivo') }));
          }}
        />

        <PrimaryButton title="Confirmar cita" icon="calendar-plus" onPress={handleAgendar} />
        <PrimaryButton title="Cancelar" variant="outline" onPress={() => router.back()} style={{ marginTop: spacing.sm }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  label: { fontSize: 14, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  nota: { fontSize: 12.5, color: colors.textMuted, marginTop: -spacing.sm, marginBottom: spacing.lg },
});
