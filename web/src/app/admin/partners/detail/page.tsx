'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { fetchPartner, updatePartner } from '@/lib/admin-api';

interface PartnerDetail {
  id: string;
  partnerUid: string;
  partnerName: string;
  partnerEmail: string;
  status: string;
  referralCode: string;
  totalReferrals: number;
  paidReferrals: number;
  pendingPayout: number;
  totalPaid: number;
  level: number;
  appliedAt: string;
  approvedAt: string | null;
  suspendedAt: string | null;
  rejectionReason: string | null;
  upiId: string | null;
  bankDetails: { accountNumber: string; ifscCode: string; accountName: string } | null;
}

function PartnerDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [partner, setPartner] = useState<PartnerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    fetchPartner(id)
      .then((data) => setPartner(data.partner))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleAction = async (action: string, reason?: string) => {
    if (!id) return;
    setSaving(true);
    try {
      const data = await updatePartner(id, action, reason);
      if (data.partner) setPartner(data.partner);
    } catch {}
    setSaving(false);
  };

  if (!id) return <div className="text-center py-12"><p className="text-text-secondary">No partner specified</p><Link href="/admin/partners" className="text-primary text-sm mt-2 inline-block">Back to partners</Link></div>;
  if (loading) return <div className="space-y-6"><div className="h-8 w-48 bg-surface rounded-card animate-pulse" /><div className="h-64 bg-surface rounded-card animate-pulse" /></div>;
  if (!partner) return <div className="text-center py-12"><p className="text-text-secondary">Partner not found</p><Link href="/admin/partners" className="text-primary text-sm mt-2 inline-block">Back to partners</Link></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/partners" className="text-text-secondary hover:text-text-primary text-sm">← Partners</Link>
        <h1 className="text-2xl font-semibold text-text-primary">Partner Details</h1>
      </div>

      <div className="bg-surface rounded-card border border-border p-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent text-xl font-medium flex-shrink-0">{partner.partnerName?.[0] || '?'}</div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-text-primary">{partner.partnerName}</h2>
            <p className="text-sm text-text-secondary">{partner.partnerEmail}</p>
            <div className="flex gap-2 mt-3">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${partner.status === 'approved' ? 'bg-success/10 text-success' : partner.status === 'pending' ? 'bg-warning/10 text-warning' : partner.status === 'suspended' ? 'bg-danger/10 text-danger' : 'bg-text-disabled/10 text-text-secondary'}`}>{partner.status}</span>
              <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">Level {partner.level}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-primary">{partner.totalReferrals}</p><p className="text-sm text-text-secondary">Total Referrals</p></div>
        <div className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-success">{partner.paidReferrals}</p><p className="text-sm text-text-secondary">Paid Referrals</p></div>
        <div className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-warning">₹{partner.pendingPayout.toLocaleString('en-IN')}</p><p className="text-sm text-text-secondary">Pending Payout</p></div>
        <div className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-success">₹{partner.totalPaid.toLocaleString('en-IN')}</p><p className="text-sm text-text-secondary">Total Paid</p></div>
      </div>

      <div className="bg-surface rounded-card border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Admin Actions</h3>
        <div className="flex flex-wrap gap-3">
          {partner.status === 'pending' && (
            <>
              <button onClick={() => handleAction('approve')} disabled={saving} className="px-4 py-2 bg-success text-white rounded-card text-sm font-medium hover:bg-success/90 transition-colors disabled:opacity-50">Approve</button>
              <div className="flex gap-2">
                <input type="text" value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} placeholder="Rejection reason..." className="px-3 py-2 bg-background border border-border rounded-card text-sm" />
                <button onClick={() => handleAction('reject', rejectionReason)} disabled={saving || !rejectionReason} className="px-4 py-2 bg-danger/10 text-danger border border-danger/30 rounded-card text-sm font-medium hover:bg-danger/20 transition-colors disabled:opacity-50">Reject</button>
              </div>
            </>
          )}
          {partner.status === 'approved' && <button onClick={() => handleAction('suspend')} disabled={saving} className="px-4 py-2 bg-warning/10 text-warning border border-warning/30 rounded-card text-sm font-medium hover:bg-warning/20 transition-colors disabled:opacity-50">Suspend</button>}
          {partner.status === 'suspended' && <button onClick={() => handleAction('reactivate')} disabled={saving} className="px-4 py-2 bg-success text-white rounded-card text-sm font-medium hover:bg-success/90 transition-colors disabled:opacity-50">Reactivate</button>}
        </div>
      </div>

      <div className="bg-surface rounded-card border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Payment Details</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><dt className="text-text-disabled">Referral Code</dt><dd className="text-text-primary mt-0.5 font-mono">{partner.referralCode}</dd></div>
          <div><dt className="text-text-disabled">UPI ID</dt><dd className="text-text-primary mt-0.5">{partner.upiId || 'Not provided'}</dd></div>
          <div><dt className="text-text-disabled">Bank Account</dt><dd className="text-text-primary mt-0.5">{partner.bankDetails?.accountNumber ? '****' + partner.bankDetails.accountNumber.slice(-4) : 'Not provided'}</dd></div>
          <div><dt className="text-text-disabled">IFSC</dt><dd className="text-text-primary mt-0.5">{partner.bankDetails?.ifscCode || 'Not provided'}</dd></div>
        </dl>
      </div>

      <div className="bg-surface rounded-card border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Timeline</h3>
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between"><dt className="text-text-disabled">Applied</dt><dd className="text-text-primary">{partner.appliedAt ? new Date(partner.appliedAt).toLocaleString() : '-'}</dd></div>
          {partner.approvedAt && <div className="flex justify-between"><dt className="text-text-disabled">Approved</dt><dd className="text-text-primary">{new Date(partner.approvedAt).toLocaleString()}</dd></div>}
          {partner.suspendedAt && <div className="flex justify-between"><dt className="text-text-disabled">Suspended</dt><dd className="text-text-primary">{new Date(partner.suspendedAt).toLocaleString()}</dd></div>}
          {partner.rejectionReason && <div className="flex justify-between"><dt className="text-text-disabled">Rejection Reason</dt><dd className="text-danger">{partner.rejectionReason}</dd></div>}
        </dl>
      </div>
    </div>
  );
}

export default function PartnerDetailPage() {
  return (
    <Suspense fallback={<div className="space-y-6"><div className="h-8 w-48 bg-surface rounded-card animate-pulse" /><div className="h-64 bg-surface rounded-card animate-pulse" /></div>}>
      <PartnerDetailContent />
    </Suspense>
  );
}
