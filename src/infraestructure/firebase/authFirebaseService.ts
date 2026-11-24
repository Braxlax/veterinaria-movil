import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type Unsubscribe,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { DatosRegistro, Sesion } from '../../domain/entities/usuario';
import { obtenerAuth, obtenerFirestore } from './config';

// Mientras se crea la cuenta, Firebase abre sesión solo; esta bandera evita que la app
// la tome como un inicio de sesión antes de guardar el perfil.
let registroEnCurso = false;

const claveCache = (uid: string) => `mrpatitas:perfil:${uid}`;

function construirSesion(usuario: User, datos?: Record<string, unknown>): Sesion {
  return {
    usuario: String(datos?.usuario ?? usuario.email ?? ''),
    rol: datos?.rol === 'admin' ? 'admin' : 'cliente',
    nombre: String(datos?.nombre ?? usuario.displayName ?? ''),
    apellidos: String(datos?.apellidos ?? ''),
    correo: String(datos?.correo ?? usuario.email ?? ''),
    telefono: String(datos?.telefono ?? ''),
  };
}

async function guardarPerfilEnCache(uid: string, sesion: Sesion): Promise<void> {
  try {
    await AsyncStorage.setItem(claveCache(uid), JSON.stringify(sesion));
  } catch {
    // La caché es solo un respaldo; si falla, no pasa nada.
  }
}

async function leerPerfilEnCache(uid: string): Promise<Sesion | null> {
  try {
    const texto = await AsyncStorage.getItem(claveCache(uid));
    return texto ? (JSON.parse(texto) as Sesion) : null;
  } catch {
    return null;
  }
}

async function sinInternet(): Promise<boolean> {
  try {
    const estado = await Network.getNetworkStateAsync();
    return !(estado.isConnected && estado.isInternetReachable !== false);
  } catch {
    return false;
  }
}

export async function iniciarSesionFirebase(correo: string, contrasena: string): Promise<Sesion | null> {
  const auth = obtenerAuth();
  const db = obtenerFirestore();
  if (!auth || !db) throw new Error('Firebase no está configurado. Revisa el archivo .env.');
  const credencial = await signInWithEmailAndPassword(auth, correo.trim(), contrasena);
  const perfil = await getDoc(doc(db, 'usuarios', credencial.user.uid));
  const sesion = construirSesion(credencial.user, perfil.data());
  void guardarPerfilEnCache(credencial.user.uid, sesion);
  return sesion;
}

export async function registrarUsuarioFirebase(datos: DatosRegistro): Promise<void> {
  const auth = obtenerAuth();
  const db = obtenerFirestore();
  if (!auth || !db) throw new Error('Firebase no está configurado. Revisa el archivo .env.');
  registroEnCurso = true;
  try {
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
  } finally {
    // La pantalla de registro avisa "Ya puedes iniciar sesión", así que cerramos la sesión automática.
    try {
      await signOut(auth);
    } catch {
      /* sin sesión que cerrar */
    }
    registroEnCurso = false;
  }
}

export async function cerrarSesionFirebase(): Promise<void> {
  const auth = obtenerAuth();
  if (!auth) return;
  const uid = auth.currentUser?.uid;
  await signOut(auth);
  if (uid) {
    try {
      await AsyncStorage.removeItem(claveCache(uid));
    } catch {
      /* nada que limpiar */
    }
  }
}

export function observarSesionFirebase(onSesion: (sesion: Sesion | null) => void): Unsubscribe | (() => void) {
  const auth = obtenerAuth();
  const db = obtenerFirestore();
  if (!auth || !db) return () => undefined;
  return onAuthStateChanged(auth, async usuario => {
    if (registroEnCurso) return;
    if (!usuario) {
      onSesion(null);
      return;
    }

    // Sin internet usamos el último perfil guardado, para no sacar al usuario de la app.
    if (await sinInternet()) {
      const enCache = await leerPerfilEnCache(usuario.uid);
      if (enCache) {
        onSesion(enCache);
        return;
      }
    }

    try {
      const perfil = await getDoc(doc(db, 'usuarios', usuario.uid));
      const sesion = construirSesion(usuario, perfil.data());
      void guardarPerfilEnCache(usuario.uid, sesion);
      onSesion(sesion);
    } catch (error) {
      console.warn('[Firebase Auth] No se pudo recuperar el perfil, se usa el guardado en el dispositivo:', error);
      // Hay sesión de Firebase válida: no la cerramos por un fallo de red.
      onSesion((await leerPerfilEnCache(usuario.uid)) ?? construirSesion(usuario));
    }
  });
}
