'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { fetchPartners } from '@/lib/admin-api';
import type { AdminPartner } from '@/lib/admin-types';

export default function PartnersPage() {
  const [partners, setPartners] = useState<AdminPartner[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    fetchPartners(filter)
      .then((data) => setPartners(data.partners))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [filter]);

  const stats = {
    total: partners.length,
    approved: partners.filter((p) => p.status === 'approved').length,
    pending: partners.filter((p) => p.status === 'pending').length,
    suspended: partners.filter((p) => p.status === 'suspended').length,
  };

  const statusColors: Record<string, string> = {
    approved: 'bg-success/10 text-success', pending: 'bg-warning/10 text-warning',
    suspended: 'bg-danger/10 text-danger', rejected: 'bg-text-disabled/10 text-text-secondary',
    inactive: 'bg-text-disabled/10 text-text-disabled',
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold text-text-primary">Partners</h1><p className="text-text-secondary mt-1">Manage partner accounts and referrals</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-primary">{stats.total}</p><p className="text-sm text-text-secondary">Total</p></motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-success">{stats.approved}</p><p className="text-sm text-text-secondary">Approved</p></motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-warning">{stats.pending}</p><p className="text-sm text-text-secondary">Pending</p></motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-danger">{stats.suspended}</p><p className="text-sm text-text-secondary">Suspended</p></motion.div>
      </div>

      <div className="flex gap-2">
        {['all', 'pending', 'approved', 'suspended', 'rejected'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-2 rounded-card text-sm font-medium transition-colors ${filter === f ? 'bg-primary text-white' : 'bg-surface border border-border text-text-secondary hover:text-text-primary'}`}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <div className="bg-surface rounded-card border border-border overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="p-4 animate-pulse"><div className="h-10 bg-background rounded" /></div>)}</div>
        ) : partners.length === 0 ? (
          <div className="p-12 text-center text-text-secondary text-sm">No partners found</div>
        ) : (
          <div className="divide-y divide-border">
            {partners.map((partner) => (
              <Link key={partner.id} href={`/admin/partners/detail?id=${partner.id}`} className="flex items-center gap-4 p-4 hover:bg-background/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent text-sm font-medium flex-shrink-0">{partner.partnerName?.[0] || '?'}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate">{partner.partnerName}</p>
                  <p className="text-xs text-text-secondary truncate">{partner.partnerEmail}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[partner.status] || ''}`}>{partner.status}</span>
                  <span className="text-xs text-text-disabled">{partner.paidReferrals} paid</span>
                  <span className="text-xs text-text-disabled">₹{partner.pendingPayout}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
