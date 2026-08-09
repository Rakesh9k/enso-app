'use client';
import { useAuth } from '@/components/auth/AuthProvider';
import StatCard from '@/components/portal/StatCard';
export default function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-editorial text-text-primary mb-2">
        Welcome back, {user?.displayName || 'there'}
      </h1>
      <p className="text-sm text-text-secondary mb-8">Your quiet space awaits.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Journals" value="—" />
        <StatCard label="Streak" value="—" />
        <StatCard label="Insights" value="—" />
        <StatCard label="XP" value="—" />
      </div>
    </div>
  );
}
