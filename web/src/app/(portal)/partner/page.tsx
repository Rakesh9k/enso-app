'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { fetchPartnerDashboard } from '@/lib/admin-api';
import { useAuth } from '@/components/auth/AuthProvider';

interface PartnerData {
  status: string;
  partnerName: string;
  referralCode: string;
  totalReferrals: number;
  paidReferrals: number;
  pendingPayout: number;
  totalPaid: number;
  level: number;
}

export default function PartnerPage() {
  const { user } = useAuth();
  const [partner, setPartner] = useState<PartnerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notPartner, setNotPartner] = useState(false);

  useEffect(() => {
    fetchPartnerDashboard()
      .then((data) => {
        if (data.partner) setPartner(data.partner);
        else setNotPartner(true);
      })
      .catch(() => setNotPartner(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-editorial text-text-primary mb-8">Partner Dashboard</h1>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-card p-6 animate-pulse">
              <div className="h-5 w-32 bg-background rounded mb-2" />
              <div className="h-3 w-48 bg-background rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (notPartner) {
    return (
      <div>
        <h1 className="text-2xl font-editorial text-text-primary mb-4">Partner Program</h1>
        <p className="text-text-secondary mb-6">Share Enso with others and earn commissions on premium subscriptions.</p>
        <div className="bg-surface border border-border rounded-card p-8 text-center">
          <p className="text-text-secondary mb-4">Become an Enso Partner</p>
          <Link href="/partners/apply" className="inline-block px-6 py-2.5 bg-primary text-white rounded-card text-sm font-medium hover:bg-primary/90 transition-colors">
            Apply Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-editorial text-text-primary mb-2">Partner Dashboard</h1>
      <p className="text-sm text-text-secondary mb-8">Welcome, {partner?.partnerName || user?.displayName}</p>

      {/* Status */}
      <div className={`p-4 rounded-card mb-6 ${partner?.status === 'approved' ? 'bg-success/5 border border-success/20' : 'bg-warning/5 border border-warning/20'}`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${partner?.status === 'approved' ? 'bg-success' : 'bg-warning'}`} />
          <span className="text-sm font-medium text-text-primary capitalize">{partner?.status}</span>
          <span className="text-xs text-text-secondary">· Level {partner?.level}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-card p-4 text-center">
          <p className="text-2xl font-semibold text-primary">{partner?.totalReferrals || 0}</p>
          <p className="text-xs text-text-secondary">Total Referrals</p>
        </div>
        <div className="bg-surface border border-border rounded-card p-4 text-center">
          <p className="text-2xl font-semibold text-success">{partner?.paidReferrals || 0}</p>
          <p className="text-xs text-text-secondary">Paid</p>
        </div>
        <div className="bg-surface border border-border rounded-card p-4 text-center">
          <p className="text-2xl font-semibold text-warning">₹{(partner?.pendingPayout || 0).toLocaleString('en-IN')}</p>
          <p className="text-xs text-text-secondary">Pending</p>
        </div>
        <div className="bg-surface border border-border rounded-card p-4 text-center">
          <p className="text-2xl font-semibold text-success">₹{(partner?.totalPaid || 0).toLocaleString('en-IN')}</p>
          <p className="text-xs text-text-secondary">Total Paid</p>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-surface border border-border rounded-card p-6 mb-6">
        <h2 className="text-sm font-medium text-text-primary mb-3">Your Referral Code</h2>
        <div className="flex items-center justify-between p-3 bg-background rounded-card border border-border">
          <code className="text-lg font-mono text-text-primary tracking-wider">{partner?.referralCode || '—'}</code>
          <button
            onClick={() => navigator.clipboard.writeText(partner?.referralCode || '')}
            className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
          >
            Copy
          </button>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-surface border border-border rounded-card divide-y divide-border">
        <Link href="/partner/invite" className="block p-4 hover:bg-background transition-colors text-sm text-text-primary">Invite Friends</Link>
        <Link href="/partner/earnings" className="block p-4 hover:bg-background transition-colors text-sm text-text-primary">Earnings</Link>
        <Link href="/partner/referrals" className="block p-4 hover:bg-background transition-colors text-sm text-text-primary">My Referrals</Link>
        <Link href="/partner/academy" className="block p-4 hover:bg-background transition-colors text-sm text-text-primary">Partner Academy</Link>
        <Link href="/partner/settings" className="block p-4 hover:bg-background transition-colors text-sm text-text-primary">Partner Settings</Link>
      </div>
    </div>
  );
}
