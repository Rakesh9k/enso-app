'use client';

import { AuthProvider } from '@/components/auth/AuthProvider';
import Navbar from './Navbar';
import Footer from './Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </AuthProvider>
  );
}
