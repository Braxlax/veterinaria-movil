import { DatosRegistro, Sesion } from '../entities/usuario';

export type ResultadoRegistro = { ok: true } | { ok: false; mensaje: string };

export interface AuthRepository {
  autenticar(usuario: string, contrasena: string): Promise<Sesion | null>;
  registrar(datos: DatosRegistro): Promise<ResultadoRegistro>;
  recuperarContrasena(correo: string): Promise<ResultadoRegistro>;
  cerrarSesion(): Promise<void>;
}
