'use client';

import { useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthProvider';

interface AdminContextType {
  isAdmin: boolean;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType>({ isAdmin: false, loading: true });

export function useAdmin() {
  return useContext(AdminContext);
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setLoading(false);
      return;
    }

    user.getIdTokenResult()
      .then((result) => {
        const admin = result.claims.admin === true;
        setIsAdmin(admin);
        setLoading(false);
        if (!admin) {
          router.push('/dashboard');
        }
      })
      .catch(() => {
        setIsAdmin(false);
        setLoading(false);
        router.push('/dashboard');
      });
  }, [user, authLoading, router]);

  return (
    <AdminContext.Provider value={{ isAdmin, loading }}>
      {children}
    </AdminContext.Provider>
  );
}
