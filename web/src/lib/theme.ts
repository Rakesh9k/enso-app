export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  primaryLight: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
}

export interface ThemeFonts {
  sans: string;
  editorial: string;
}

export interface ThemeRadii {
  card: string;
  pill: string;
  button: string;
}

export interface EnsoTheme {
  id: string;
  label: string;
  isDark: boolean;
  colors: ThemeColors;
  gradient: string;
  whisper: string;
  fonts: ThemeFonts;
  radii: ThemeRadii;
  owl: {
    calm: string;
    breathe: string;
    idle: string;
  };
  ambient: {
    particleCount: number;
    particleSpeed: number;
    breatheMs: number;
  };
}

const defaultTheme: EnsoTheme = {
  id: 'light',
  label: 'Light',
  isDark: false,
  colors: {
    background: '#F9FAFB',
    surface: '#FFFFFF',
    primary: '#4F46E5',
    primaryLight: '#818CF8',
    textPrimary: '#1C1A17',
    textSecondary: '#6E6959',
    border: '#E5E2DB',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#DC2626',
  },
  gradient: 'linear-gradient(135deg, #F7F3EA 0%, #F0EBE0 100%)',
  whisper: 'Breathe',
  fonts: {
    sans: 'Inter, ui-sans-serif, system-ui, sans-serif',
    editorial: 'Newsreader, Georgia, serif',
  },
  radii: {
    card: '12px',
    pill: '24px',
    button: '10px',
  },
  owl: {
    calm: '/mascots/owl_calm.png',
    breathe: '/mascots/owl_breathe.png',
    idle: '/mascots/owl_idle.png',
  },
  ambient: {
    particleCount: 20,
    particleSpeed: 0.3,
    breatheMs: 3200,
  },
};

export default defaultTheme;
