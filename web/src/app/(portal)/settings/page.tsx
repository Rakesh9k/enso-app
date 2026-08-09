'use client';
import { signOut } from '@/lib/auth';
export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-editorial text-text-primary mb-8">Settings</h1>
      <div className="bg-surface border border-border rounded-card p-6 mb-6">
        <h2 className="text-lg font-medium text-text-primary mb-4">Account</h2>
        <p className="text-sm text-text-secondary mb-4">Manage your account settings.</p>
        <button onClick={() => signOut()} className="px-4 py-2 rounded-button border border-danger text-danger text-sm font-medium hover:bg-danger/5">
          Sign Out
        </button>
      </div>
    </div>
  );
}
