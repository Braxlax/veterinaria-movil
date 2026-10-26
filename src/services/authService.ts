import { CUENTAS_INICIALES } from '../data/cuentas';
import { Cuenta, DatosRegistro, Sesion } from '../models/usuario';

const esperar = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const cuentas: Cuenta[] = [...CUENTAS_INICIALES];

const aSesion = ({ contrasena: _omitida, ...sesion }: Cuenta): Sesion => sesion;

export const authService = {
  async autenticar(usuario: string, contrasena: string): Promise<Sesion | null> {
    await esperar(600);
    const normalizado = usuario.trim().toLowerCase();
    const cuenta = cuentas.find((c) => c.usuario.toLowerCase() === normalizado && c.contrasena === contrasena);
    return cuenta ? aSesion(cuenta) : null;
  },

  async registrar(datos: DatosRegistro): Promise<{ ok: true } | { ok: false; mensaje: string }> {
    await esperar(600);
    const existe = cuentas.some((c) => c.usuario.toLowerCase() === datos.usuario.trim().toLowerCase());
    if (existe) return { ok: false, mensaje: 'Ese nombre de usuario ya está registrado.' };
    cuentas.push({
      ...datos,
      usuario: datos.usuario.trim(),
      nombre: datos.nombre.trim(),
      apellidos: datos.apellidos.trim(),
      correo: datos.correo.trim(),
      telefono: datos.telefono.trim(),
      rol: 'cliente',
    });
    return { ok: true };
  },
};
