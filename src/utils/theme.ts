export const colors = {
  primary: '#EC4899',      
  primarySoft: '#FBCFE8',  
  background: '#FFF7F9',   
  text: '#1F2937',         
  accent: '#FB923C',       
  primaryDark: '#BE185D',
  surface: '#FFFFFF',
  border: '#F4DCE7',
  textMuted: '#6B7280',
  danger: '#DC2626',
  dangerSoft: '#FEE2E2',
  success: '#16A34A',
  white: '#FFFFFF',
};

export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 };
export const radius = { sm: 8, md: 12, lg: 16, pill: 999 };

export const typography = {
  titulo: { fontSize: 22, fontWeight: '800' as const },
  subtitulo: { fontSize: 17, fontWeight: '800' as const },
  cuerpo: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  etiqueta: { fontSize: 14, fontWeight: '700' as const },
  detalle: { fontSize: 12.5, fontWeight: '400' as const },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
};
