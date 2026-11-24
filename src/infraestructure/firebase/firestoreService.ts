import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { eliminarSincronizadosAusentes, guardarRegistroDesdeNube, OperacionPendiente, TipoRegistroLocal } from '../database/database';
import { obtenerAuth, obtenerFirestore } from './config';

const colecciones: Record<TipoRegistroLocal, string> = {
  mascotas: 'mascotas',
  citas: 'citas',
  solicitudes: 'solicitudes',
};

export async function sincronizarOperacionFirebase(pendiente: OperacionPendiente): Promise<void> {
  const db = obtenerFirestore();
  const auth = obtenerAuth();
  if (!db || !auth?.currentUser) throw new Error('No hay una sesión de Firebase activa para sincronizar.');
  if (pendiente.ownerUid !== auth.currentUser.uid) throw new Error('La operación pendiente pertenece a otra cuenta.');
  const referencia = doc(db, colecciones[pendiente.tipo], pendiente.registroId);
  if (pendiente.operacion === 'eliminar') {
    await deleteDoc(referencia);
    return;
  }
  const datos = pendiente.datos ? (JSON.parse(pendiente.datos) as Record<string, unknown>) : {};
  const propietarioOriginal = typeof datos.ownerUid === 'string' ? datos.ownerUid : auth.currentUser.uid;
  await setDoc(
    referencia,
    {
      ...datos,
      id: pendiente.registroId,
      ownerUid: propietarioOriginal,
      actualizadoEn: new Date().toISOString(),
    },
    { merge: true },
  );
}

export async function descargarDatosFirebase(tipo: TipoRegistroLocal): Promise<void> {
  const db = obtenerFirestore();
  const auth = obtenerAuth();
  const usuario = auth?.currentUser;
  if (!db || !usuario) return;

  const perfil = await getDoc(doc(db, 'usuarios', usuario.uid));
  const esAdmin = perfil.data()?.rol === 'admin';
  const referencia = collection(db, colecciones[tipo]);
  const consulta = esAdmin ? referencia : query(referencia, where('ownerUid', '==', usuario.uid));
  const resultado = await getDocs(consulta);
  for (const documento of resultado.docs) {
    const datos = documento.data() as Record<string, unknown>;
    await guardarRegistroDesdeNube(tipo, { ...datos, id: documento.id } as { id: string });
  }
  // Solo si la respuesta vino realmente del servidor (no de la caché sin conexión),
  // quitamos del dispositivo lo que ya no existe en la nube.
  if (!resultado.metadata.fromCache) {
    await eliminarSincronizadosAusentes(
      tipo,
      resultado.docs.map(documento => documento.id),
    );
  }
}

export async function obtenerDocumentoFirebase(coleccionNombre: string, id: string) {
  const db = obtenerFirestore();
  if (!db) return null;
  const resultado = await getDoc(doc(db, coleccionNombre, id));
  return resultado.exists() ? resultado.data() : null;
}
