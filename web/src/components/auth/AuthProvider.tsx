'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthChange } from '@/lib/auth';
import { ensureUserDoc } from '@/lib/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
      setLoading(false);

      if (user && syncedRef.current !== user.uid) {
        syncedRef.current = user.uid;
        ensureUserDoc(user).catch((e) => {
          console.error('[AuthProvider] ensureUserDoc failed:', e);
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
