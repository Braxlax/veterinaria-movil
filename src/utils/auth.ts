// Autenticación local de demostración. No sustituye un servidor ni una base de datos.
export type RolUsuario = 'admin' | 'usuario';
export type Cuenta = { usuario: string; contrasena: string; rol: RolUsuario };

const cuentas: Cuenta[] = [
  { usuario: 'admin', contrasena: 'patitas123', rol: 'admin' },
  { usuario: 'usuario', contrasena: 'usuario123', rol: 'usuario' },
];

export const CREDENCIALES_DEMO = {
  administrador: { usuario: 'admin', contrasena: 'patitas123' },
  usuario: { usuario: 'usuario', contrasena: 'usuario123' },
};

export function autenticar(usuario: string, contrasena: string): Cuenta | null {
  const normalizado = usuario.trim().toLowerCase();
  return cuentas.find(c => c.usuario.toLowerCase() === normalizado && c.contrasena === contrasena) ?? null;
}

export function validarCredenciales(usuario: string, contrasena: string): boolean {
  return autenticar(usuario, contrasena) !== null;
}

export function registrarCuenta(
  usuario: string,
  contrasena: string
): { ok: boolean; mensaje?: string } {
  const normalizado = usuario.trim();

  console.log('Usuario ingresado:', normalizado);
  console.log(
    'Usuarios actuales:',
    cuentas.map(c => c.usuario)
  );

  const existe = cuentas.some(
    c => c.usuario.toLowerCase() === normalizado.toLowerCase()
  );

  console.log('¿Ya existe?', existe);

  if (existe) {
    return {
      ok: false,
      mensaje: 'Ese nombre de usuario ya está registrado.'
    };
  }

  // Solo se conservan usuario y contraseña.
  // Los datos personales del formulario no se almacenan.
  cuentas.push({
    usuario: normalizado,
    contrasena,
    rol: 'usuario'
  });

  console.log('Cuenta creada correctamente:', normalizado);

  return { ok: true };
}
