'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import StatCard from '@/components/portal/StatCard';
import { useEffect, useState } from 'react';
import { fetchPortalDashboard } from '@/lib/admin-api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ journals: 0, meditationMinutes: 0, insights: 0, streak: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortalDashboard()
      .then((data) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-editorial text-text-primary mb-2">
        Welcome back, {user?.displayName || 'there'}
      </h1>
      <p className="text-sm text-text-secondary mb-8">Your quiet space awaits.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Journals" value={loading ? '—' : String(stats.journals)} />
        <StatCard label="Streak" value={loading ? '—' : `${stats.streak}d`} />
        <StatCard label="Insights" value={loading ? '—' : String(stats.insights)} />
        <StatCard label="Minutes" value={loading ? '—' : String(stats.meditationMinutes)} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface border border-border rounded-card p-6">
          <h2 className="text-lg font-editorial text-text-primary mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a href="/journal" className="block p-3 rounded-card bg-background hover:bg-primary/5 transition-colors text-sm text-text-primary">Start a journal entry</a>
            <a href="/insights" className="block p-3 rounded-card bg-background hover:bg-primary/5 transition-colors text-sm text-text-primary">View your insights</a>
            <a href="/profile" className="block p-3 rounded-card bg-background hover:bg-primary/5 transition-colors text-sm text-text-primary">Manage your profile</a>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-card p-6">
          <h2 className="text-lg font-editorial text-text-primary mb-4">Your Practice</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {stats.journals === 0
              ? "You haven't written any journal entries yet. Start with one honest line."
              : `You've written ${stats.journals} journal entries${stats.meditationMinutes > 0 ? ` and meditated for ${stats.meditationMinutes} minutes` : ''}. Keep going.`}
          </p>
        </div>
      </div>
    </div>
  );
}
