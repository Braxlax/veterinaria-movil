export const CREDENCIALES_DEMO = {
  usuario: 'admin',
  contrasena: 'patitas123',
};

export function validarCredenciales(usuario: string, contrasena: string): boolean {
  return usuario.trim().toLowerCase() === CREDENCIALES_DEMO.usuario && contrasena === CREDENCIALES_DEMO.contrasena;
}
