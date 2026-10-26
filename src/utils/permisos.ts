import { RolUsuario } from '../models/usuario';

export interface Permisos {
  crearSolicitud: boolean;
  verTodo: boolean;
  editarSolicitud: boolean;
  eliminarSolicitud: boolean;
  gestionarAgenda: boolean;
  registrarClinico: boolean;
  eliminarMascota: boolean;
}

const MATRIZ: Record<RolUsuario, Permisos> = {
  admin: { crearSolicitud: true, verTodo: true, editarSolicitud: true, eliminarSolicitud: true, gestionarAgenda: true, registrarClinico: true, eliminarMascota: true },
  cliente: { crearSolicitud: true, verTodo: false, editarSolicitud: false, eliminarSolicitud: false, gestionarAgenda: false, registrarClinico: false, eliminarMascota: true },
};

export const permisosDe = (rol: RolUsuario): Permisos => MATRIZ[rol];

export const ROL_INFO: Record<RolUsuario, { label: string; icon: 'shield-crown' | 'account-heart'; descripcion: string }> = {
  admin: { label: 'Administrador', icon: 'shield-crown', descripcion: 'Gestiona toda la clínica' },
  cliente: { label: 'Cliente', icon: 'account-heart', descripcion: 'Gestiona sus mascotas y citas' },
};
