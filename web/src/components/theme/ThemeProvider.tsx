'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { subscribeToUserProfile } from '@/lib/firestore';
import { themes } from '@/lib/themes';

interface ThemeContextType {
  themeId: string;
  setThemeId: (id: string) => void;
}

const ThemeContext = createContext<ThemeContextType>({ themeId: 'dune', setThemeId: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export function RoomProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [themeId, setThemeIdState] = useState('dune');

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserProfile(user.uid, (data) => {
      if (data && typeof data.room === 'string') {
        const t = data.room.toLowerCase();
        if (themes[t]) setThemeIdState(t);
      }
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    const theme = themes[themeId];
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty('--color-background', theme.colors.background);
    root.style.setProperty('--color-surface', theme.colors.surface);
    root.style.setProperty('--color-primary', theme.colors.primary);
    root.style.setProperty('--color-primary-light', theme.colors.primaryLight);
    root.style.setProperty('--color-text-primary', theme.colors.textPrimary);
    root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);
    root.style.setProperty('--color-border', theme.colors.border);
    root.style.setProperty('--color-success', theme.colors.success);
    root.style.setProperty('--color-warning', theme.colors.warning);
    root.style.setProperty('--color-danger', theme.colors.danger);
  }, [themeId]);

  const setThemeId = (id: string) => {
    setThemeIdState(id);
  };

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}
