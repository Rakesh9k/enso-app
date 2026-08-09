'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Content Management</h1>
        <p className="text-text-secondary mt-1">Manage blog posts, changelogs, and notifications</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/content/blog"
          className="bg-surface rounded-card border border-border p-6 hover:border-primary/30 transition-colors group"
        >
          <div className="text-3xl mb-3">📝</div>
          <h2 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">Blog</h2>
          <p className="text-sm text-text-secondary mt-1">Create and manage blog posts, meditation scripts, and educational content</p>
        </Link>
        <Link
          href="/admin/content/changelog"
          className="bg-surface rounded-card border border-border p-6 hover:border-primary/30 transition-colors group"
        >
          <div className="text-3xl mb-3">📋</div>
          <h2 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">Changelog</h2>
          <p className="text-sm text-text-secondary mt-1">Track app updates and new features</p>
        </Link>
        <Link
          href="/admin/content/notifications"
          className="bg-surface rounded-card border border-border p-6 hover:border-primary/30 transition-colors group"
        >
          <div className="text-3xl mb-3">🔔</div>
          <h2 className="text-lg font-semibold text-text-primary group-hover:text-primary transition-colors">Notifications</h2>
          <p className="text-sm text-text-secondary mt-1">Send push notifications and in-app messages</p>
        </Link>
      </div>
    </div>
  );
}
