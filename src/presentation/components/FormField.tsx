import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { colors, radius, spacing, typography } from '../theme/theme';
import { AppIcon } from './AppIcon';

interface Props extends TextInputProps {
  label: string;
  error?: string;
  required?: boolean;
}

export function FormField({ label, error, required, style, onFocus, onBlur, secureTextEntry, ...inputProps }: Props) {
  const [enfocado, setEnfocado] = useState(false);
  const [contrasenaVisible, setContrasenaVisible] = useState(false);
  const esContrasena = !!secureTextEntry;
  const { maxLength, value } = inputProps;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}
        {required ? <Text style={styles.required}> *</Text> : null}
      </Text>
      <View style={styles.inputWrapper}>
        <TextInput
          placeholderTextColor={colors.placeholder}
          accessibilityLabel={label}
          style={[
            styles.input,
            esContrasena && styles.inputConIcono,
            enfocado && styles.inputFocus,
            !!error && styles.inputError,
            inputProps.multiline && styles.multiline,
            style,
          ]}
          onFocus={e => {
            setEnfocado(true);
            onFocus?.(e);
          }}
          onBlur={e => {
            setEnfocado(false);
            onBlur?.(e);
          }}
          {...inputProps}
          secureTextEntry={esContrasena && !contrasenaVisible}
        />
        {esContrasena ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={contrasenaVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            hitSlop={8}
            onPress={() => setContrasenaVisible(actual => !actual)}
            style={styles.ojo}
          >
            <AppIcon name={contrasenaVisible ? 'eye-off' : 'eye'} size={22} color={colors.textMuted} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.footer}>
        {error ? (
          <View style={styles.errorRow} accessibilityRole="alert">
            <AppIcon name="alert-circle" size={14} color={colors.danger} />
            <Text style={styles.error}>{error}</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }} />
        )}
        {inputProps.multiline && maxLength ? (
          <Text style={styles.counter}>
            {(value ?? '').length}/{maxLength}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.sm },
  label: { ...typography.etiqueta, color: colors.text, marginBottom: spacing.xs + 2 },
  required: { color: colors.danger },
  inputWrapper: { justifyContent: 'center' },
  input: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.md,
    fontSize: 15,
    color: colors.text,
  },
  inputConIcono: { paddingRight: 48 },
  ojo: { position: 'absolute', right: spacing.md, top: 0, bottom: 0, justifyContent: 'center' },
  inputFocus: { borderColor: colors.primary, backgroundColor: colors.focusBg },
  inputError: { borderColor: colors.danger, backgroundColor: colors.dangerSoft },
  multiline: { minHeight: 96, textAlignVertical: 'top' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', minHeight: 20, marginTop: spacing.xs },
  errorRow: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 },
  error: { flex: 1, color: colors.danger, fontSize: 12.5, fontWeight: '600' },
  counter: { ...typography.detalle, color: colors.textMuted, marginLeft: spacing.sm },
});
