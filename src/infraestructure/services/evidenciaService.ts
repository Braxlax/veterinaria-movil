import * as ImagePicker from 'expo-image-picker';
import { obtenerAuth } from '../firebase/config';
import { subirArchivoFirebase } from '../firebase/storageService';

/** Permite seleccionar una imagen del dispositivo y subirla a la carpeta privada del usuario. */
export async function seleccionarYSubirEvidencia(): Promise<string | null> {
  const usuario = obtenerAuth()?.currentUser;
  if (!usuario) throw new Error('Inicia sesión con Firebase antes de subir una imagen.');

  const permiso = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permiso.granted) throw new Error('Se necesita permiso para acceder a tus fotografías.');

  const seleccion = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    quality: 0.8,
  });
  if (seleccion.canceled || !seleccion.assets[0]?.uri) return null;

  const archivo = seleccion.assets[0];
  const extension = archivo.fileName?.split('.').pop()?.toLowerCase() || 'jpg';
  return subirArchivoFirebase(archivo.uri, `usuarios/${usuario.uid}/evidencias/${Date.now()}.${extension}`);
}
