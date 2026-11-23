import type { TipoRegistroLocal } from './database';

type Listener = (tipo: TipoRegistroLocal) => void;
const listeners = new Set<Listener>();

export function escucharCambiosLocales(listener: Listener) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function notificarCambioLocal(tipo: TipoRegistroLocal) {
  listeners.forEach((listener) => listener(tipo));
}
