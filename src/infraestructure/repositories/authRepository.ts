import { AuthRepository } from '../../domain/repositories/authRepository';
import { authService } from '../services/authService';

export const authRepository: AuthRepository = {
  autenticar: (usuario, contrasena) => authService.autenticar(usuario, contrasena),
  registrar: (datos) => authService.registrar(datos),
  cerrarSesion: () => authService.cerrarSesion(),
};
