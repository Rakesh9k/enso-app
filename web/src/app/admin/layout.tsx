'use client';

import { ReactNode, Suspense } from 'react';
import { AdminProvider } from '@/components/admin/AdminAuthProvider';
import AdminSidebar from '@/components/admin/AdminLayout';

function AdminLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-secondary">Loading admin panel...</p>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProvider>
      <AdminSidebar>
        <Suspense fallback={<AdminLoading />}>{children}</Suspense>
      </AdminSidebar>
    </AdminProvider>
  );
}
