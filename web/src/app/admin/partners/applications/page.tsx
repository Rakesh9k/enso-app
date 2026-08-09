'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Application {
  id: string;
  partnerUid: string;
  partnerName: string;
  partnerEmail: string;
  status: string;
  appliedAt: string;
  bio: string;
  socialLinks: string[];
}

export default function PartnerApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const fetchApplications = () => {
    fetch('/api/admin/partners?status=pending')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setApplications(data.partners);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleAction = async (id: string, action: string, reason?: string) => {
    setSaving(id);
    try {
      const res = await fetch(`/api/admin/partners/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, reason }),
      });
      if (res.ok) {
        setApplications((prev) => prev.filter((a) => a.id !== id));
      }
    } catch {}
    setSaving(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Partner Applications</h1>
        <p className="text-text-secondary mt-1">Review and process pending applications</p>
      </div>

      <div className="bg-surface rounded-card border border-border overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse"><div className="h-20 bg-background rounded" /></div>
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-text-secondary text-sm">No pending applications</div>
        ) : (
          <div className="divide-y divide-border">
            {applications.map((app) => (
              <div key={app.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{app.partnerName}</h3>
                    <p className="text-xs text-text-secondary">{app.partnerEmail}</p>
                    <p className="text-xs text-text-disabled mt-1">Applied: {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : '-'}</p>
                  </div>
                </div>
                {app.bio && (
                  <p className="text-sm text-text-secondary bg-background rounded-card p-3">{app.bio}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAction(app.id, 'approve')}
                    disabled={saving === app.id}
                    className="px-4 py-2 bg-success text-white rounded-card text-sm font-medium hover:bg-success/90 transition-colors disabled:opacity-50"
                  >
                    {saving === app.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Rejection reason:');
                      if (reason) handleAction(app.id, 'reject', reason);
                    }}
                    disabled={saving === app.id}
                    className="px-4 py-2 bg-danger/10 text-danger border border-danger/30 rounded-card text-sm font-medium hover:bg-danger/20 transition-colors disabled:opacity-50"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
