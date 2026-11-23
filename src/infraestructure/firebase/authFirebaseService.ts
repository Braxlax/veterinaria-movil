import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile, type Unsubscribe } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { DatosRegistro, Sesion } from '../../domain/entities/usuario';
import { obtenerAuth, obtenerFirestore } from './config';

export async function iniciarSesionFirebase(correo: string, contrasena: string): Promise<Sesion | null> {
  const auth = obtenerAuth();
  const db = obtenerFirestore();
  if (!auth || !db) throw new Error('Firebase no está configurado. Revisa el archivo .env.');
  const credencial = await signInWithEmailAndPassword(auth, correo.trim(), contrasena);
  const perfil = await getDoc(doc(db, 'usuarios', credencial.user.uid));
  const datos = perfil.data();
  return {
    usuario: String(datos?.usuario ?? credencial.user.email ?? ''),
    rol: datos?.rol === 'admin' ? 'admin' : 'cliente',
    nombre: String(datos?.nombre ?? credencial.user.displayName ?? ''),
    apellidos: String(datos?.apellidos ?? ''),
    correo: String(datos?.correo ?? credencial.user.email ?? ''),
    telefono: String(datos?.telefono ?? ''),
  };
}

export async function registrarUsuarioFirebase(datos: DatosRegistro): Promise<void> {
  const auth = obtenerAuth();
  const db = obtenerFirestore();
  if (!auth || !db) throw new Error('Firebase no está configurado. Revisa el archivo .env.');
  const credencial = await createUserWithEmailAndPassword(auth, datos.correo.trim(), datos.contrasena);
  await updateProfile(credencial.user, { displayName: `${datos.nombre.trim()} ${datos.apellidos.trim()}` });
  await setDoc(doc(db, 'usuarios', credencial.user.uid), {
    usuario: datos.usuario.trim(),
    nombre: datos.nombre.trim(),
    apellidos: datos.apellidos.trim(),
    correo: datos.correo.trim().toLowerCase(),
    telefono: datos.telefono.trim(),
    rol: 'cliente',
    creadoEn: new Date().toISOString(),
  });
}

export async function cerrarSesionFirebase(): Promise<void> {
  const auth = obtenerAuth();
  if (auth) await signOut(auth);
}


export function observarSesionFirebase(onSesion: (sesion: Sesion | null) => void): Unsubscribe | (() => void) {
  const auth = obtenerAuth();
  const db = obtenerFirestore();
  if (!auth || !db) return () => undefined;
  return onAuthStateChanged(auth, async (usuario) => {
    if (!usuario) {
      onSesion(null);
      return;
    }
    try {
      const perfil = await getDoc(doc(db, 'usuarios', usuario.uid));
      const datos = perfil.data();
      onSesion({
        usuario: String(datos?.usuario ?? usuario.email ?? ''),
        rol: datos?.rol === 'admin' ? 'admin' : 'cliente',
        nombre: String(datos?.nombre ?? usuario.displayName ?? ''),
        apellidos: String(datos?.apellidos ?? ''),
        correo: String(datos?.correo ?? usuario.email ?? ''),
        telefono: String(datos?.telefono ?? ''),
      });
    } catch (error) {
      console.warn('[Firebase Auth] No se pudo recuperar el perfil:', error);
      onSesion(null);
    }
  });
}
