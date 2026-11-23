

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

export const validarDescripcion = (valor: string, campo = 'La descripción'): string | undefined => {
  const v = valor.trim();
  if (!v) return `${campo} es obligatoria.`;
  if (v.length < 10) return `${campo} debe tener al menos 10 caracteres.`;
  if (v.length > 300) return 'Máximo 300 caracteres.';
  return undefined;
};

export const validarCorreo = (valor: string): string | undefined => {
  const v = valor.trim();
  if (!v) return 'El correo es obligatorio.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Ingresa un correo válido (ej. nombre@correo.com).';
  return undefined;
};

export const validarUsuario = (valor: string): string | undefined => {
  const v = valor.trim();
  if (!v) return 'El usuario es obligatorio.';
  if (v.length < 3) return 'El usuario debe tener al menos 3 caracteres.';
  if (!/^[A-Za-z0-9._]+$/.test(v)) return 'Usa solo letras, números, punto o guion bajo.';
  return undefined;
};

export const validarContrasena = (valor: string): string | undefined => {
  if (!valor) return 'La contraseña es obligatoria.';
  if (valor.length < 8) return 'La contraseña debe tener al menos 8 caracteres.';
  return undefined;
};

export const validarNumero = (valor: string, campo: string, min: number, max: number): string | undefined => {
  const v = valor.trim().replace(',', '.');
  if (!v) return `${campo} es obligatorio.`;
  const n = Number(v);
  if (Number.isNaN(n)) return `${campo} debe ser un número.`;
  if (n < min || n > max) return `${campo} debe estar entre ${min} y ${max}.`;
  return undefined;
};

export const hayErrores = <T extends object>(errors: T): boolean => Object.values(errors).some(Boolean);

export type FormErrors = Partial<Record<'clienteNombre' | 'telefono' | 'mascotaNombre' | 'descripcion', string>>;

export interface FormValues {
  clienteNombre: string;
  telefono: string;
  mascotaNombre: string;
  descripcion: string;
}

export const validarFormulario = (values: FormValues): FormErrors => ({
  clienteNombre: validarNombre(values.clienteNombre, 'El nombre del cliente'),
  telefono: validarTelefono(values.telefono),
  mascotaNombre: validarNombre(values.mascotaNombre, 'El nombre de la mascota'),
  descripcion: validarDescripcion(values.descripcion),
});
