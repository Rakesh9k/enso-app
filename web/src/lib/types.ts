export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  subscriptionTier: 'FREE' | 'PREMIUM' | 'PRO';
  currentStreak: number;
  totalJournals: number;
  createdAt: Date;
  updatedAt: Date;
  themePreference: 'LIGHT' | 'DARK' | 'SYSTEM';
  companion: string;
  room: string;
}

export interface UserStats {
  totalJournals: number;
  currentStreak: number;
  longestStreak: number;
  totalSessions: number;
  joinedDate: Date;
}

export type RoomId = 'chalk' | 'paper' | 'mist' | 'dusk' | 'rain' | 'tide' | 'garden' | 'aurora';

export interface RoomTheme {
  id: RoomId;
  label: string;
  subtitle: string;
  isDark: boolean;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
}
