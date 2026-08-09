'use client';
import ProtectedRoute from '@/components/portal/ProtectedRoute';
import PortalLayout from '@/components/portal/PortalLayout';
export default function PortalLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <PortalLayout>{children}</PortalLayout>
    </ProtectedRoute>
  );
}
