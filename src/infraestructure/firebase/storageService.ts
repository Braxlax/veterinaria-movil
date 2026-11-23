import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { obtenerStorage } from './config';

export async function subirArchivoFirebase(uri: string, ruta: string): Promise<string> {
  const storage = obtenerStorage();
  if (!storage) throw new Error('Firebase Storage no está configurado. Revisa el archivo .env.');
  const respuesta = await fetch(uri);
  if (!respuesta.ok) throw new Error('No se pudo leer el archivo seleccionado.');
  const archivo = await respuesta.blob();
  const referencia = ref(storage, ruta);
  await uploadBytes(referencia, archivo);
  return getDownloadURL(referencia);
}
