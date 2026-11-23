import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseConfigurado = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

let app: FirebaseApp | null = null;
let authInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let storageInstance: FirebaseStorage | null = null;

function obtenerApp(): FirebaseApp | null {
  if (!firebaseConfigurado) return null;
  if (!app) app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return app;
}

export function obtenerAuth(): Auth | null {
  const instancia = obtenerApp();
  if (!instancia) return null;
  if (!authInstance) {
    if (Platform.OS === 'web') {
      authInstance = getAuth(instancia);
    } else {
      try {
        authInstance = initializeAuth(instancia, { persistence: getReactNativePersistence(AsyncStorage) });
      } catch {
        authInstance = getAuth(instancia);
      }
    }
  }
  return authInstance;
}

export function obtenerFirestore(): Firestore | null {
  const instancia = obtenerApp();
  if (!instancia) return null;
  if (!firestoreInstance) firestoreInstance = getFirestore(instancia);
  return firestoreInstance;
}

export function obtenerStorage(): FirebaseStorage | null {
  const instancia = obtenerApp();
  if (!instancia) return null;
  if (!storageInstance) storageInstance = getStorage(instancia);
  return storageInstance;
}
