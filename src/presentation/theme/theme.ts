
export const colors = {
  primary: '#5E7B24',
  primaryDark: '#46601A',
  brand: '#78943B',
  primarySoft: '#EAF0D8',
  accent: '#B3904B',

  background: '#FFF9ED',
  surface: '#FFFFFF',
  surfaceAlt: '#F6F0DF',
  border: '#E4DCC3',

  text: '#2B2A22',
  textMuted: '#6B6A5E',
  white: '#FFFFFF',

  danger: '#C0392B',
  dangerSoft: '#FBE4E0',
  success: '#2F7A47',
  successSoft: '#DDF2E3',
  warning: '#9A6A00',
  warningSoft: '#FFF1D6',
  info: '#1F5F9E',
  infoSoft: '#DCEBFA',
  neutral: '#4F6472',
  neutralSoft: '#E8EEF2',
  violet: '#8E4A9E',
  violetSoft: '#F3E6F7',
  dangerBorder: '#F2B8B0',
  placeholder: '#9CA3AF',
  focusBg: '#FDFFF7',
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
    shadowColor: '#3B3320',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
};

export const headerOptions = {
  headerStyle: { backgroundColor: colors.primary },
  headerTintColor: colors.white,
  headerTitleStyle: { fontWeight: '700' as const, fontSize: 18, color: colors.white },
  headerShadowVisible: false,
};
