import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppIcon } from '../components/AppIcon';
import { Chip } from '../components/Chip';
import { DatoFila } from '../components/DatoFila';
import { EmptyState } from '../components/EmptyState';
import { estadoVacunacion } from '../components/MascotaCard';
import { PrimaryButton } from '../components/PrimaryButton';
import { CampoModal, RegistroClinicoModal } from '../components/RegistroClinicoModal';
import { SectionHeader } from '../components/SectionHeader';
import { usePermisos } from '../hooks/usePermisos';
import { useCitas } from '../store/CitaContext';
import { useMascotas } from '../store/MascotaContext';
import { useToast } from '../store/ToastContext';
import { confirmar } from '../utils/alerts';
import { ESPECIE_INFO } from '../utils/constants';
import { diasHasta, enDias, formatearSoloFecha } from '../utils/fechas';
import { colors, radius, shadow, spacing } from '../utils/theme';
import { validarDescripcion, validarNumero } from '../utils/validators';

const obligatorio = (campo: string) => (v: string) => (v.trim().length < 3 ? `${campo} es obligatorio (mín. 3 caracteres).` : undefined);

const CAMPOS_VACUNA: CampoModal[] = [
  { clave: 'nombre', label: 'Vacuna aplicada', requerido: true, placeholder: 'Ej. Antirrábica', validar: obligatorio('La vacuna') },
  {
    clave: 'meses',
    label: 'Próxima dosis en (meses)',
    placeholder: 'Ej. 12 (dejar vacío si no aplica)',
    validar: (v) => (v.trim() ? validarNumero(v, 'Los meses', 1, 36) : undefined),
  },
];

const CAMPOS_CONSULTA: CampoModal[] = [
  { clave: 'motivo', label: 'Motivo de consulta', requerido: true, placeholder: 'Ej. Control anual', validar: obligatorio('El motivo') },
  { clave: 'diagnostico', label: 'Diagnóstico', requerido: true, multiline: true, placeholder: 'Resultado del examen', validar: (v) => validarDescripcion(v, 'El diagnóstico') },
  { clave: 'tratamiento', label: 'Tratamiento', requerido: true, multiline: true, placeholder: 'Medicación e indicaciones', validar: (v) => validarDescripcion(v, 'El tratamiento') },
];

export default function MascotaDetalleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const toast = useToast();
  const { obtenerMascota, eliminarMascota, registrarVacuna, registrarConsulta } = useMascotas();
  const { eliminarCitasDeMascota } = useCitas();
  const { registrarClinico, eliminarMascota: puedeEliminar } = usePermisos();

  const [modal, setModal] = useState<'vacuna' | 'consulta' | null>(null);
  const mascota = obtenerMascota(id ?? '');

  if (!mascota) return <EmptyState icon="paw" title="Mascota no encontrada" message="Es posible que haya sido eliminada." />;

  const especie = ESPECIE_INFO[mascota.especie];
  const vac = estadoVacunacion(mascota);

  const handleEliminar = () =>
    confirmar('Eliminar mascota', `¿Eliminar la ficha de ${mascota.nombre}? También se quitarán sus citas. Esta acción no se puede deshacer.`, 'Eliminar', () => {
      router.back();
      eliminarCitasDeMascota(mascota.id);
      eliminarMascota(mascota.id);
      toast(`Ficha de ${mascota.nombre} eliminada`, 'success');
    });

  const guardarVacuna = (v: Record<string, string>) => {
    const meses = v.meses?.trim() ? Math.round(Number(v.meses.replace(',', '.'))) : 0;
    registrarVacuna(mascota.id, v.nombre, meses > 0 ? enDias(meses * 30) : undefined);
    setModal(null);
    toast('Vacuna registrada en el carnet', 'success');
  };

  const guardarConsulta = (v: Record<string, string>) => {
    registrarConsulta(mascota.id, v.motivo, v.diagnostico, v.tratamiento);
    setModal(null);
    toast('Consulta agregada al historial', 'success');
  };

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + spacing.xxl }]} style={styles.screen}>

      <View style={styles.ficha}>
        <View style={styles.avatar}>
          <AppIcon name={especie.icon} size={40} color={colors.white} />
        </View>
        <Text style={styles.nombre}>{mascota.nombre}</Text>
        <Text style={styles.raza}>
          {especie.label} · {mascota.raza}
        </Text>
        <Chip {...vac} />
      </View>

      <View style={styles.card}>
        <DatoFila icon="cake-variant" label="Edad" value={`${mascota.edadAnios} ${mascota.edadAnios === 1 ? 'año' : 'años'}`} />
        <DatoFila icon="scale-bathroom" label="Peso" value={`${mascota.pesoKg} kg`} />
        <DatoFila icon="account" label="Dueño" value={mascota.duenoNombre} />
        <DatoFila icon="phone" label="Teléfono" value={mascota.duenoTelefono} />
        <DatoFila icon="medical-bag" label="Alergias" value={mascota.alergias} />
      </View>

      <View style={styles.acciones}>
        <PrimaryButton title="Solicitar atención" icon="clipboard-text" onPress={() => router.push({ pathname: '/crear', params: { mascotaId: mascota.id } })} />
        <PrimaryButton title="Agendar cita" icon="calendar-plus" variant="outline" onPress={() => router.push({ pathname: '/cita-nueva', params: { mascotaId: mascota.id } })} />
        <PrimaryButton title="Editar ficha" icon="pencil" variant="outline" onPress={() => router.push({ pathname: '/mascota-nueva', params: { id: mascota.id } })} />
      </View>

      <SectionHeader titulo="Carnet de vacunación" accion={registrarClinico ? '+ Registrar' : undefined} onAccion={() => setModal('vacuna')} />
      {mascota.vacunas.length === 0 ? (
        <Text style={styles.vacio}>Aún no hay vacunas registradas.</Text>
      ) : (
        mascota.vacunas.map((v) => {
          const dias = v.proxima ? diasHasta(v.proxima) : null;
          const chip =
            dias === null
              ? { label: 'Sin refuerzo', bg: colors.surfaceAlt, fg: colors.textMuted }
              : dias < 0
                ? { label: 'Vencida', bg: colors.dangerSoft, fg: colors.danger }
                : dias <= 30
                  ? { label: `Vence en ${dias} d`, bg: colors.warningSoft, fg: colors.warning }
                  : { label: 'Vigente', bg: colors.successSoft, fg: colors.success };
          return (
            <View key={v.id} style={styles.item}>
              <View style={styles.itemIcon}>
                <AppIcon name="needle" size={20} color={colors.success} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTitulo}>{v.nombre}</Text>
                <Text style={styles.itemSub}>
                  Aplicada: {formatearSoloFecha(v.fecha)}
                  {v.proxima ? ` · Próxima: ${formatearSoloFecha(v.proxima)}` : ''}
                </Text>
              </View>
              <Chip {...chip} />
            </View>
          );
        })
      )}

      <SectionHeader titulo="Historial clínico" accion={registrarClinico ? '+ Registrar' : undefined} onAccion={() => setModal('consulta')} />
      {mascota.historial.length === 0 ? (
        <Text style={styles.vacio}>Sin consultas registradas.</Text>
      ) : (
        mascota.historial.map((h) => (
          <View key={h.id} style={styles.consulta}>
            <View style={styles.consultaTop}>
              <AppIcon name="file-document-outline" size={18} color={colors.primary} />
              <Text style={styles.itemTitulo}>{h.motivo}</Text>
              <Text style={styles.itemSub}>{formatearSoloFecha(h.fecha)}</Text>
            </View>
            <Text style={styles.consultaLinea}>
              <Text style={styles.consultaEtiqueta}>Diagnóstico: </Text>
              {h.diagnostico}
            </Text>
            <Text style={styles.consultaLinea}>
              <Text style={styles.consultaEtiqueta}>Tratamiento: </Text>
              {h.tratamiento}
            </Text>
          </View>
        ))
      )}

      {puedeEliminar ? <PrimaryButton title="Eliminar mascota" icon="delete-outline" variant="danger" onPress={handleEliminar} style={{ marginTop: spacing.xl }} /> : null}

      <RegistroClinicoModal visible={modal === 'vacuna'} titulo="Registrar vacuna" campos={CAMPOS_VACUNA} textoGuardar="Guardar vacuna" onCerrar={() => setModal(null)} onGuardar={guardarVacuna} />
      <RegistroClinicoModal visible={modal === 'consulta'} titulo="Registrar consulta" campos={CAMPOS_CONSULTA} textoGuardar="Guardar consulta" onCerrar={() => setModal(null)} onGuardar={guardarConsulta} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  ficha: { alignItems: 'center', gap: spacing.xs, marginBottom: spacing.lg },
  avatar: { width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  nombre: { fontSize: 26, fontWeight: '800', color: colors.text },
  raza: { fontSize: 14.5, color: colors.textMuted, marginBottom: spacing.sm },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: spacing.lg, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  acciones: { gap: spacing.sm, marginTop: spacing.lg },
  vacio: { color: colors.textMuted, fontSize: 14, paddingVertical: spacing.sm },
  item: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm },
  itemIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: colors.successSoft, alignItems: 'center', justifyContent: 'center' },
  itemTitulo: { fontSize: 15, fontWeight: '700', color: colors.text, flexShrink: 1 },
  itemSub: { fontSize: 12.5, color: colors.textMuted, marginTop: 1 },
  consulta: { backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.sm, gap: 4 },
  consultaTop: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: 2 },
  consultaLinea: { fontSize: 13.5, color: colors.text, lineHeight: 19 },
  consultaEtiqueta: { fontWeight: '800', color: colors.primaryDark },
});
