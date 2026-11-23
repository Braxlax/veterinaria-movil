import { RolUsuario } from '../entities/usuario';

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
  admin: {
    crearSolicitud: true,
    verTodo: true,
    editarSolicitud: true,
    eliminarSolicitud: true,
    gestionarAgenda: true,
    registrarClinico: true,
    eliminarMascota: true,
  },
  cliente: {
    crearSolicitud: true,
    verTodo: false,
    editarSolicitud: false,
    eliminarSolicitud: false,
    gestionarAgenda: false,
    registrarClinico: false,
    eliminarMascota: true,
  },
};

export const permisosDe = (rol: RolUsuario): Permisos => MATRIZ[rol];
