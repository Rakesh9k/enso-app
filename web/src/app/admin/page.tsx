'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { fetchDashboardStats } from '@/lib/admin-api';
import type { AdminStats } from '@/lib/admin-types';

const statCards = [
  { key: 'totalUsers', label: 'Total Users', icon: '👥', color: 'text-primary' },
  { key: 'activeSubscriptions', label: 'Active Subscriptions', icon: '💳', color: 'text-success' },
  { key: 'totalPartners', label: 'Total Partners', icon: '🤝', color: 'text-accent' },
  { key: 'pendingApplications', label: 'Pending Applications', icon: '📋', color: 'text-warning' },
  { key: 'monthlyRevenue', label: 'Monthly Revenue', icon: '💰', color: 'text-success' },
  { key: 'totalJournalEntries', label: 'Journal Entries', icon: '📝', color: 'text-primary' },
  { key: 'totalMeditationMinutes', label: 'Meditation Minutes', icon: '🧘', color: 'text-accent' },
  { key: 'aiInsightsGenerated', label: 'AI Insights Generated', icon: '🤖', color: 'text-primary' },
];

const quickLinks = [
  { href: '/admin/users', label: 'Manage Users', description: 'View and manage user accounts' },
  { href: '/admin/partners/applications', label: 'Partner Applications', description: 'Review pending applications' },
  { href: '/admin/subscriptions', label: 'Subscriptions', description: 'Monitor subscription metrics' },
  { href: '/admin/ai', label: 'AI Insights', description: 'Monitor AI job queue and outputs' },
  { href: '/admin/system/health', label: 'System Health', description: 'Service status and monitoring' },
  { href: '/admin/content/blog', label: 'Blog Management', description: 'Create and manage blog posts' },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats()
      .then((data) => setStats(data.stats))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Admin Dashboard</h1>
        <p className="text-text-secondary mt-1">Overview of your Enso platform</p>
      </div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <motion.div key={card.key} variants={item} className="bg-surface rounded-card border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{card.icon}</span>
              {loading ? (
                <div className="h-6 w-16 bg-background rounded animate-pulse" />
              ) : (
                <span className={`text-2xl font-semibold ${card.color}`}>
                  {card.key === 'monthlyRevenue'
                    ? `₹${((stats?.[card.key as keyof AdminStats] as number) || 0).toLocaleString('en-IN')}`
                    : ((stats?.[card.key as keyof AdminStats] as number) || 0).toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary">{card.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickLinks.map((link) => (
            <Link key={link.href} href={link.href} className="block bg-surface rounded-card border border-border p-5 hover:border-primary/30 transition-colors group">
              <h3 className="text-sm font-semibold text-text-primary group-hover:text-primary transition-colors">{link.label}</h3>
              <p className="text-xs text-text-secondary mt-1">{link.description}</p>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text-primary mb-4">Recent Activity</h2>
        <div className="bg-surface rounded-card border border-border p-6">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 bg-background rounded animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-text-secondary text-sm">
              <p>Activity feed will appear here as users interact with the platform.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
