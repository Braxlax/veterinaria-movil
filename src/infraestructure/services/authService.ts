import { CUENTAS_INICIALES } from '../data/cuentas';
import { Cuenta, DatosRegistro, Sesion } from '../../domain/entities/usuario';
import { ResultadoRegistro } from '../../domain/repositories/authRepository';
import { firebaseConfigurado } from '../firebase/config';
import { cerrarSesionFirebase, iniciarSesionFirebase, registrarUsuarioFirebase } from '../firebase/authFirebaseService';

const esperar = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const cuentas: Cuenta[] = [...CUENTAS_INICIALES];
const aSesion = ({ contrasena: _omitida, ...sesion }: Cuenta): Sesion => sesion;

function mensajeAuth(error: unknown): string {
  const codigo = (error as { code?: string })?.code;
  switch (codigo) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found': return 'Correo o contraseña incorrectos.';
    case 'auth/email-already-in-use': return 'Este correo ya tiene una cuenta registrada.';
    case 'auth/weak-password': return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/invalid-email': return 'El correo electrónico no tiene un formato válido.';
    case 'auth/network-request-failed': return 'No se pudo conectar con Firebase. Comprueba tu conexión.';
    default: return error instanceof Error ? error.message : 'No se pudo completar la operación de autenticación.';
  }
}

export const authService = {
  async autenticar(usuario: string, contrasena: string): Promise<Sesion | null> {
    if (firebaseConfigurado) {
      try {
        return await iniciarSesionFirebase(usuario, contrasena);
      } catch (error) {
        throw new Error(mensajeAuth(error));
      }
    }
    await esperar(400);
    const normalizado = usuario.trim().toLowerCase();
    const cuenta = cuentas.find((c) => c.usuario.toLowerCase() === normalizado && c.contrasena === contrasena);
    return cuenta ? aSesion(cuenta) : null;
  },

  async registrar(datos: DatosRegistro): Promise<ResultadoRegistro> {
    if (firebaseConfigurado) {
      try {
        await registrarUsuarioFirebase(datos);
        return { ok: true };
      } catch (error) {
        return { ok: false, mensaje: mensajeAuth(error) };
      }
    }
    await esperar(400);
    const existe = cuentas.some((c) => c.usuario.toLowerCase() === datos.usuario.trim().toLowerCase());
    if (existe) return { ok: false, mensaje: 'Ese nombre de usuario ya está registrado.' };
    cuentas.push({ ...datos, usuario: datos.usuario.trim(), nombre: datos.nombre.trim(), apellidos: datos.apellidos.trim(), correo: datos.correo.trim(), telefono: datos.telefono.trim(), rol: 'cliente' });
    return { ok: true };
  },

  async cerrarSesion(): Promise<void> {
    if (firebaseConfigurado) await cerrarSesionFirebase();
  },
};
