const p2 = (n: number) => n.toString().padStart(2, '0');
const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export const enDias = (dias: number, hora = 9, minuto = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  d.setHours(hora, minuto, 0, 0);
  return d.toISOString();
};

export const haceDias = (dias: number): string => enDias(-dias, 10, 0);

export const mismoDia = (a: Date | string, b: Date | string): boolean => {
  const x = new Date(a);
  const y = new Date(b);
  return x.getFullYear() === y.getFullYear() && x.getMonth() === y.getMonth() && x.getDate() === y.getDate();
};

export const formatearHora = (iso: string): string => {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : `${p2(d.getHours())}:${p2(d.getMinutes())}`;
};

export const formatearDiaCorto = (iso: string): string => {
  const d = new Date(iso);
  return `${DIAS[d.getDay()]} ${d.getDate()} ${MESES[d.getMonth()]}`;
};

export const formatearSoloFecha = (iso: string): string => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return `${p2(d.getDate())}/${p2(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export const proximosDias = (n: number): { iso: string; dia: string; numero: string; mes: string }[] =>
  Array.from({ length: n }, (_, i) => {
    const iso = enDias(i, 0, 0);
    const d = new Date(iso);
    return { iso, dia: i === 0 ? 'Hoy' : DIAS[d.getDay()], numero: String(d.getDate()), mes: MESES[d.getMonth()] };
  });

export const combinarFechaHora = (diaIso: string, hora: string): string => {
  const [h, m] = hora.split(':').map(Number);
  const d = new Date(diaIso);
  d.setHours(h, m, 0, 0);
  return d.toISOString();
};

export const diasHasta = (iso: string): number => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const f = new Date(iso);
  f.setHours(0, 0, 0, 0);
  return Math.round((f.getTime() - hoy.getTime()) / 86_400_000);
};
