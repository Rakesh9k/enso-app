'use client';

import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="text-text-secondary mt-1">Platform configuration and feature flags</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/settings/feature-flags"
          className="bg-surface rounded-card border border-border p-6 hover:border-primary/30 transition-colors group"
        >
          <div className="text-3xl mb-3">🚩</div>
          <h2 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">Feature Flags</h2>
          <p className="text-sm text-text-secondary mt-1">Control feature rollout and visibility</p>
        </Link>
      </div>
    </div>
  );
}
