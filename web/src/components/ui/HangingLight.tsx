'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { subscribeToUserProfile } from '@/lib/firestore';
import { themes } from '@/lib/themes';

export default function HangingLight({ children }: { children?: React.ReactNode }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('dune');

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeToUserProfile(user.uid, (data) => {
      if (data && typeof data.themePreference === 'string') {
        const t = data.themePreference.toLowerCase();
        if (themes[t]) setCurrentTheme(t);
      }
    });
    return () => unsub();
  }, [user]);

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 right-4 z-50 w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center hover:bg-background transition-colors"
        title="Theme"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
        </svg>
      </button>
      {open && (
        <div className="fixed top-14 right-4 z-50 bg-surface border border-border rounded-card p-3 shadow-lg">
          <p className="text-xs text-text-secondary mb-2">Theme</p>
          <div className="flex gap-2">
            {Object.keys(themes).map((id) => (
              <button
                key={id}
                onClick={() => { setCurrentTheme(id); setOpen(false); }}
                className={`w-6 h-6 rounded-full border-2 transition-colors ${
                  currentTheme === id ? 'border-primary' : 'border-border'
                }`}
                style={{ background: themes[id].colors.background }}
                title={themes[id].label}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
