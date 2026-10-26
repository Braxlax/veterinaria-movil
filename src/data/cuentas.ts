import { Cuenta } from '../models/usuario';

export const CUENTAS_INICIALES: Cuenta[] = [
  { usuario: 'admin', contrasena: 'patitas123', rol: 'admin', nombre: 'Sofía', apellidos: 'Mendoza', correo: 'admin@mrpatitas.pe', telefono: '999111222' },
  { usuario: 'usuario', contrasena: 'usuario123', rol: 'cliente', nombre: 'Ana', apellidos: 'Torres', correo: 'ana.torres@correo.com', telefono: '912345987' },
];
