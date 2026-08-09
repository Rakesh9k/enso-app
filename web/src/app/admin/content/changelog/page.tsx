'use client';

export default function ChangelogAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Changelog</h1>
          <p className="text-text-secondary mt-1">Track app updates and new features</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded-card text-sm font-medium hover:bg-primary/90 transition-colors">
          New Entry
        </button>
      </div>

      <div className="bg-surface rounded-card border border-border p-12 text-center text-text-secondary text-sm">
        Changelog entries will appear here. Click "New Entry" to add one.
      </div>
    </div>
  );
}
