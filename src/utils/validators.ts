export type FormErrors = Partial<Record<'clienteNombre' | 'telefono' | 'mascotaNombre' | 'descripcion', string>>;

export interface FormValues {
  clienteNombre: string;
  telefono: string;
  mascotaNombre: string;
  descripcion: string;
}

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü' ]+$/;

export const validarNombre = (valor: string, campo: string): string | undefined => {
  const v = valor.trim();
  if (!v) return `${campo} es obligatorio.`;
  if (v.length < 2) return `${campo} debe tener al menos 2 caracteres.`;
  if (!SOLO_LETRAS.test(v)) return `${campo} solo puede contener letras.`;
  return undefined;
};

export const validarTelefono = (valor: string): string | undefined => {
  const v = valor.trim();
  if (!v) return 'El teléfono es obligatorio.';
  if (!/^\d+$/.test(v)) return 'Ingresa solo números.';
  if (v.length !== 9) return 'El teléfono debe tener 9 dígitos.';
  if (!v.startsWith('9')) return 'El celular debe empezar con 9.';
  return undefined;
};

export const validarDescripcion = (valor: string): string | undefined => {
  const v = valor.trim();
  if (!v) return 'La descripción es obligatoria.';
  if (v.length < 10) return 'Describe el motivo con al menos 10 caracteres.';
  if (v.length > 300) return 'Máximo 300 caracteres.';
  return undefined;
};

export const validarFormulario = (values: FormValues): FormErrors => ({
  clienteNombre: validarNombre(values.clienteNombre, 'El nombre del cliente'),
  telefono: validarTelefono(values.telefono),
  mascotaNombre: validarNombre(values.mascotaNombre, 'El nombre de la mascota'),
  descripcion: validarDescripcion(values.descripcion),
});

export const hayErrores = (errors: FormErrors): boolean => Object.values(errors).some(Boolean);
