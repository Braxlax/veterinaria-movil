// Credenciales de demostración para el proyecto académico.
// En una aplicación real, la autenticación debe validarse en un servidor seguro.
export const CREDENCIALES_DEMO = {
  usuario: 'admin',
  contrasena: 'patitas123',
};

export function validarCredenciales(usuario: string, contrasena: string): boolean {
  return (
    usuario.trim().toLowerCase() === CREDENCIALES_DEMO.usuario &&
    contrasena === CREDENCIALES_DEMO.contrasena
  );
}
