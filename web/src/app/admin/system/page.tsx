'use client';

import Link from 'next/link';

export default function SystemPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">System</h1>
        <p className="text-text-secondary mt-1">Service health, AI jobs, webhooks, and audit logs</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/system/health"
          className="bg-surface rounded-card border border-border p-6 hover:border-primary/30 transition-colors group"
        >
          <div className="text-3xl mb-3">💚</div>
          <h2 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">Health</h2>
          <p className="text-sm text-text-secondary mt-1">Service status and monitoring</p>
        </Link>
        <Link
          href="/admin/system/ai-jobs"
          className="bg-surface rounded-card border border-border p-6 hover:border-primary/30 transition-colors group"
        >
          <div className="text-3xl mb-3">🤖</div>
          <h2 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">AI Jobs</h2>
          <p className="text-sm text-text-secondary mt-1">Monitor AI pipeline execution</p>
        </Link>
        <Link
          href="/admin/system/webhooks"
          className="bg-surface rounded-card border border-border p-6 hover:border-primary/30 transition-colors group"
        >
          <div className="text-3xl mb-3">🔗</div>
          <h2 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">Webhooks</h2>
          <p className="text-sm text-text-secondary mt-1">Manage webhook endpoints</p>
        </Link>
        <Link
          href="/admin/system/audit-logs"
          className="bg-surface rounded-card border border-border p-6 hover:border-primary/30 transition-colors group"
        >
          <div className="text-3xl mb-3">📋</div>
          <h2 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">Audit Logs</h2>
          <p className="text-sm text-text-secondary mt-1">Admin action history</p>
        </Link>
      </div>
    </div>
  );
}
