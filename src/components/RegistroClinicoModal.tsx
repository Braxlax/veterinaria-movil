import React, { useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '../utils/theme';
import { FormField } from './FormField';
import { PrimaryButton } from './PrimaryButton';

export interface CampoModal {
  clave: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;

  validar: (valor: string) => string | undefined;
  requerido?: boolean;
}

interface Props {
  visible: boolean;
  titulo: string;
  campos: CampoModal[];
  textoGuardar: string;
  onCerrar: () => void;
  onGuardar: (valores: Record<string, string>) => void;
}

export function RegistroClinicoModal({ visible, titulo, campos, textoGuardar, onCerrar, onGuardar }: Props) {
  const [valores, setValores] = useState<Record<string, string>>({});
  const [errores, setErrores] = useState<Record<string, string | undefined>>({});

  const cerrar = () => {
    setValores({});
    setErrores({});
    onCerrar();
  };

  const guardar = () => {
    const nuevos: Record<string, string | undefined> = {};
    campos.forEach((c) => (nuevos[c.clave] = c.validar(valores[c.clave] ?? '')));
    setErrores(nuevos);
    if (Object.values(nuevos).some(Boolean)) return;
    onGuardar(valores);
    setValores({});
    setErrores({});
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={cerrar}>
      <KeyboardAvoidingView style={styles.overlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <Pressable style={styles.backdrop} onPress={cerrar} accessibilityLabel="Cerrar" />
        <View style={styles.sheet}>
          <View style={styles.handle} />
          <Text style={styles.titulo}>{titulo}</Text>
          <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {campos.map((c) => (
              <FormField
                key={c.clave}
                label={c.label}
                required={c.requerido}
                placeholder={c.placeholder}
                multiline={c.multiline}
                maxLength={c.multiline ? 300 : undefined}
                value={valores[c.clave] ?? ''}
                error={errores[c.clave]}
                onChangeText={(t) => {
                  setValores((v) => ({ ...v, [c.clave]: t }));
                  if (errores[c.clave]) setErrores((e) => ({ ...e, [c.clave]: c.validar(t) }));
                }}
              />
            ))}
            <View style={styles.actions}>
              <PrimaryButton title={textoGuardar} icon="check" onPress={guardar} />
              <PrimaryButton title="Cancelar" variant="outline" onPress={cerrar} style={{ marginTop: spacing.sm }} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  backdrop: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(30,28,20,0.45)' },
  sheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.lg + 8,
    borderTopRightRadius: radius.lg + 8,
    padding: spacing.lg,
    paddingBottom: spacing.xl,
    maxHeight: '88%',
  },
  handle: { alignSelf: 'center', width: 44, height: 5, borderRadius: 3, backgroundColor: colors.border, marginBottom: spacing.md },
  titulo: { fontSize: 20, fontWeight: '800', color: colors.text, marginBottom: spacing.md },
  actions: { marginTop: spacing.sm, marginBottom: spacing.lg },
});
