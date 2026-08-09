'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';
import { fetchUser, updateUser, deleteUser } from '@/lib/admin-api';
import type { AdminUser } from '@/lib/admin-types';

function UserDetail() {
  const searchParams = useSearchParams();
  const uid = searchParams.get('uid');
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [activity, setActivity] = useState<{ journalEntries: number; meditationSessions: number; insightsGenerated: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!uid) { setLoading(false); return; }
    fetchUser(uid)
      .then((data) => { setUser(data.user); setActivity(data.activity); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [uid]);

  const handleToggleAdmin = async () => {
    if (!user || !uid) return;
    setSaving(true);
    try {
      await updateUser(uid, { admin: !user.isAdmin });
      setUser({ ...user, isAdmin: !user.isAdmin });
    } catch {}
    setSaving(false);
  };

  const handleSubscriptionChange = async (sub: string) => {
    if (!user || !uid) return;
    setSaving(true);
    try {
      await updateUser(uid, { subscription: sub });
      setUser({ ...user, subscription: sub });
    } catch {}
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!uid || !confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    setSaving(true);
    try {
      await deleteUser(uid);
      router.push('/admin/users');
    } catch {}
    setSaving(false);
  };

  if (!uid) return <div className="text-center py-12"><p className="text-text-secondary">No user specified</p><Link href="/admin/users" className="text-primary text-sm mt-2 inline-block">Back to users</Link></div>;
  if (loading) return <div className="space-y-6"><div className="h-8 w-48 bg-surface rounded-card animate-pulse" /><div className="h-64 bg-surface rounded-card animate-pulse" /></div>;
  if (!user) return <div className="text-center py-12"><p className="text-text-secondary">User not found</p><Link href="/admin/users" className="text-primary text-sm mt-2 inline-block">Back to users</Link></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/users" className="text-text-secondary hover:text-text-primary text-sm">← Users</Link>
        <h1 className="text-2xl font-semibold text-text-primary">User Details</h1>
      </div>

      <div className="bg-surface rounded-card border border-border p-6">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-medium overflow-hidden flex-shrink-0">
            {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : user.displayName?.[0] || user.email?.[0] || '?'}
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-text-primary">{user.displayName || 'No name'}</h2>
            <p className="text-sm text-text-secondary">{user.email}</p>
            <p className="text-xs text-text-disabled mt-1">UID: {user.uid}</p>
            <div className="flex gap-2 mt-3">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${user.subscription === 'premium' || user.subscription === 'active' ? 'bg-success/10 text-success' : user.subscription === 'expired' ? 'bg-warning/10 text-warning' : 'bg-text-disabled/10 text-text-secondary'}`}>
                {user.subscription.charAt(0).toUpperCase() + user.subscription.slice(1)}
              </span>
              {user.isAdmin && <span className="px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded-full">Admin</span>}
              {user.isPartner && <span className="px-2 py-0.5 text-xs font-medium bg-accent/10 text-accent rounded-full">Partner</span>}
            </div>
          </div>
        </div>
      </div>

      {activity && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-primary">{activity.journalEntries}</p><p className="text-sm text-text-secondary">Journal Entries</p></div>
          <div className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-accent">{activity.meditationSessions}</p><p className="text-sm text-text-secondary">Meditation Sessions</p></div>
          <div className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-success">{activity.insightsGenerated}</p><p className="text-sm text-text-secondary">AI Insights</p></div>
        </div>
      )}

      <div className="bg-surface rounded-card border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Admin Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={handleToggleAdmin} disabled={saving} className={`px-4 py-2 rounded-card text-sm font-medium transition-colors ${user.isAdmin ? 'bg-warning/10 text-warning border border-warning/30 hover:bg-warning/20' : 'bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20'} disabled:opacity-50`}>
            {saving ? 'Saving...' : user.isAdmin ? 'Remove Admin' : 'Make Admin'}
          </button>
          <div className="flex gap-2">
            {['free', 'premium', 'expired'].map((sub) => (
              <button key={sub} onClick={() => handleSubscriptionChange(sub)} disabled={saving || user.subscription === sub} className={`px-3 py-2 rounded-card text-sm font-medium transition-colors ${user.subscription === sub ? 'bg-primary text-white' : 'bg-surface border border-border text-text-secondary hover:text-text-primary'} disabled:opacity-50`}>
                {sub.charAt(0).toUpperCase() + sub.slice(1)}
              </button>
            ))}
          </div>
        </div>
        <div className="pt-4 border-t border-border">
          <button onClick={handleDelete} disabled={saving} className="px-4 py-2 bg-danger/10 text-danger border border-danger/30 rounded-card text-sm font-medium hover:bg-danger/20 transition-colors disabled:opacity-50">Delete User</button>
        </div>
      </div>

      <div className="bg-surface rounded-card border border-border p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Metadata</h3>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div><dt className="text-text-disabled">Created</dt><dd className="text-text-primary mt-0.5">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</dd></div>
          <div><dt className="text-text-disabled">Last Login</dt><dd className="text-text-primary mt-0.5">{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Unknown'}</dd></div>
          <div><dt className="text-text-disabled">Last Active</dt><dd className="text-text-primary mt-0.5">{user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Unknown'}</dd></div>
          <div><dt className="text-text-disabled">Partner ID</dt><dd className="text-text-primary mt-0.5">{user.partnerId || 'None'}</dd></div>
        </dl>
      </div>
    </div>
  );
}

export default function UserDetailPage() {
  return (
    <Suspense fallback={<div className="space-y-6"><div className="h-8 w-48 bg-surface rounded-card animate-pulse" /><div className="h-64 bg-surface rounded-card animate-pulse" /></div>}>
      <UserDetail />
    </Suspense>
  );
}
