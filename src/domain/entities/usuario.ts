
export const ROLES = ['admin', 'cliente'] as const;
export type RolUsuario = (typeof ROLES)[number];

export interface Cuenta {
  usuario: string;
  contrasena: string;
  rol: RolUsuario;
  nombre: string;
  apellidos: string;
  correo: string;
  telefono: string;
}

export type Sesion = Omit<Cuenta, 'contrasena'>;

export type DatosRegistro = Omit<Cuenta, 'rol'>;
