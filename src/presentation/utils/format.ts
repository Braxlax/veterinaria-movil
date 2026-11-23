
export const formatearFecha = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const p = (n: number) => n.toString().padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

export const formatearPrecio = (soles: number): string => `S/ ${soles.toFixed(2)}`;

export const iniciales = (nombre: string, apellidos = ''): string =>
  `${nombre.trim().charAt(0)}${apellidos.trim().charAt(0)}`.toUpperCase() || '?';
