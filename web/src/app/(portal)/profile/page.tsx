'use client';

import { useAuth } from '@/components/auth/AuthProvider';
import { useEffect, useState } from 'react';
import { fetchPortalProfile } from '@/lib/admin-api';
import { signOut } from '@/lib/auth';

interface Profile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  subscription: string;
  journalCount: number;
  meditationMinutes: number;
  currentStreak: number;
  createdAt: string | null;
  isAdmin: boolean;
  isPartner: boolean;
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortalProfile()
      .then((data) => setProfile(data.profile))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const isPremium = profile?.subscription === 'premium' || profile?.subscription === 'active';

  return (
    <div>
      <h1 className="text-2xl font-editorial text-text-primary mb-8">Profile</h1>

      {/* Avatar & Info */}
      <div className="bg-surface border border-border rounded-card p-6 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-medium overflow-hidden">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.displayName?.[0] || user?.email?.[0] || '?'
            )}
          </div>
          <div>
            <p className="text-lg font-medium text-text-primary">{user?.displayName || 'User'}</p>
            <p className="text-sm text-text-secondary">{user?.email}</p>
          </div>
        </div>

        {/* Subscription Badge */}
        <div className={`p-4 rounded-card ${isPremium ? 'bg-success/5 border border-success/20' : 'bg-primary/5 border border-primary/20'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-text-primary">
                {isPremium ? 'Enso Premium' : 'Free Plan'}
              </p>
              <p className="text-xs text-text-secondary">
                {isPremium ? 'All features unlocked' : 'Upgrade for voice journaling & AI insights'}
              </p>
            </div>
            {!isPremium && (
              <a href="/subscription" className="px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
                Upgrade
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-surface border border-border rounded-card p-4 text-center">
          <p className="text-xl font-semibold text-primary">{loading ? '—' : profile?.journalCount || 0}</p>
          <p className="text-xs text-text-secondary">Journals</p>
        </div>
        <div className="bg-surface border border-border rounded-card p-4 text-center">
          <p className="text-xl font-semibold text-accent">{loading ? '—' : profile?.meditationMinutes || 0}</p>
          <p className="text-xs text-text-secondary">Minutes</p>
        </div>
        <div className="bg-surface border border-border rounded-card p-4 text-center">
          <p className="text-xl font-semibold text-success">{loading ? '—' : profile?.currentStreak || 0}</p>
          <p className="text-xs text-text-secondary">Streak</p>
        </div>
      </div>

      {/* Settings Links */}
      <div className="bg-surface border border-border rounded-card divide-y divide-border">
        <a href="/settings" className="block p-4 hover:bg-background transition-colors text-sm text-text-primary">Settings</a>
        {profile?.isAdmin && (
          <a href="/admin" className="block p-4 hover:bg-background transition-colors text-sm text-primary">Admin Panel</a>
        )}
        {profile?.isPartner && (
          <a href="/partner" className="block p-4 hover:bg-background transition-colors text-sm text-text-primary">Partner Dashboard</a>
        )}
        <button
          onClick={() => signOut()}
          className="block w-full p-4 text-left hover:bg-background transition-colors text-sm text-danger"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
