'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchSubscriptions } from '@/lib/admin-api';

interface Subscription {
  id: string;
  userId: string;
  email: string;
  plan: 'monthly' | 'yearly';
  status: string;
  amount: number;
  startDate: string;
  expiryDate: string;
  provider: string;
}

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetchSubscriptions(filter)
      .then((data) => setSubscriptions(data.subscriptions))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter((s) => s.status === 'active').length,
    expired: subscriptions.filter((s) => s.status === 'expired').length,
    revenue: subscriptions.filter((s) => s.status === 'active').reduce((sum, s) => sum + s.amount, 0),
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Subscriptions</h1>
        <p className="text-text-secondary mt-1">Monitor subscription metrics and manage plans</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-card border border-border p-5">
          <p className="text-2xl font-semibold text-primary">{stats.total}</p><p className="text-sm text-text-secondary">Total</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-surface rounded-card border border-border p-5">
          <p className="text-2xl font-semibold text-success">{stats.active}</p><p className="text-sm text-text-secondary">Active</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface rounded-card border border-border p-5">
          <p className="text-2xl font-semibold text-warning">{stats.expired}</p><p className="text-sm text-text-secondary">Expired</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-surface rounded-card border border-border p-5">
          <p className="text-2xl font-semibold text-success">₹{stats.revenue.toLocaleString('en-IN')}</p><p className="text-sm text-text-secondary">Revenue</p>
        </motion.div>
      </div>

      <div className="flex gap-2">
        {['all', 'active', 'expired', 'cancelled'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-card text-sm font-medium transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-surface border border-border text-text-secondary hover:text-text-primary'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-surface rounded-card border border-border overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="p-4 animate-pulse"><div className="h-10 bg-background rounded" /></div>)}</div>
        ) : subscriptions.length === 0 ? (
          <div className="p-12 text-center text-text-secondary text-sm">No subscriptions found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left p-4 text-text-disabled font-medium">User</th>
                <th className="text-left p-4 text-text-disabled font-medium">Plan</th>
                <th className="text-left p-4 text-text-disabled font-medium">Amount</th>
                <th className="text-left p-4 text-text-disabled font-medium">Status</th>
                <th className="text-left p-4 text-text-disabled font-medium">Start</th>
                <th className="text-left p-4 text-text-disabled font-medium">Expiry</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-background/50">
                    <td className="p-4 text-text-primary">{sub.email}</td>
                    <td className="p-4 text-text-secondary capitalize">{sub.plan}</td>
                    <td className="p-4 text-text-primary">₹{sub.amount}</td>
                    <td className="p-4"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${sub.status === 'active' ? 'bg-success/10 text-success' : sub.status === 'expired' ? 'bg-warning/10 text-warning' : 'bg-text-disabled/10 text-text-secondary'}`}>{sub.status}</span></td>
                    <td className="p-4 text-text-secondary">{sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '-'}</td>
                    <td className="p-4 text-text-secondary">{sub.expiryDate ? new Date(sub.expiryDate).toLocaleDateString() : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
