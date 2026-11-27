import { Cuenta, DatosRegistro, Sesion } from '../../domain/entities/usuario';
import { ResultadoRegistro } from '../../domain/repositories/authRepository';
import { CUENTAS_INICIALES } from '../data/cuentas';
import {
  cerrarSesionFirebase,
  enviarRecuperacionFirebase,
  iniciarSesionFirebase,
  registrarUsuarioFirebase,
} from '../firebase/authFirebaseService';
import { firebaseConfigurado } from '../firebase/config';

const esperar = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));
const cuentas: Cuenta[] = [...CUENTAS_INICIALES];
const aSesion = ({ contrasena: _omitida, ...sesion }: Cuenta): Sesion => sesion;

function mensajeAuth(error: unknown): string {
  const codigo = (error as { code?: string })?.code;
  switch (codigo) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Correo o contraseña incorrectos.';
    case 'auth/email-already-in-use':
      return 'Este correo ya tiene una cuenta registrada.';
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.';
    case 'auth/invalid-email':
      return 'El correo electrónico no tiene un formato válido.';
    case 'auth/too-many-requests':
      return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.';
    case 'auth/network-request-failed':
      return 'No se pudo conectar con Firebase. Comprueba tu conexión.';
    default:
      return error instanceof Error ? error.message : 'No se pudo completar la operación de autenticación.';
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
    const cuenta = cuentas.find(c => c.usuario.toLowerCase() === normalizado && c.contrasena === contrasena);
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
    const existe = cuentas.some(c => c.usuario.toLowerCase() === datos.usuario.trim().toLowerCase());
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

  async recuperarContrasena(correo: string): Promise<ResultadoRegistro> {
    if (!firebaseConfigurado) {
      return { ok: false, mensaje: 'La recuperación de contraseña solo está disponible con Firebase configurado.' };
    }
    const limpio = correo.trim();
    if (!/^\S+@\S+\.\S+$/.test(limpio)) {
      return { ok: false, mensaje: 'Escribe un correo electrónico válido.' };
    }
    try {
      await enviarRecuperacionFirebase(limpio);
      return { ok: true };
    } catch (error) {
      // Si el correo no existe respondemos igual que si existiera, para no revelar qué cuentas hay registradas.
      if ((error as { code?: string })?.code === 'auth/user-not-found') return { ok: true };
      return { ok: false, mensaje: mensajeAuth(error) };
    }
  },

  async cerrarSesion(): Promise<void> {
    if (firebaseConfigurado) await cerrarSesionFirebase();
  },
};
