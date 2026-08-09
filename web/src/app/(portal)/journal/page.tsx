'use client';

import { useEffect, useState } from 'react';
import { fetchPortalJournal } from '@/lib/admin-api';
import { useAuth } from '@/components/auth/AuthProvider';

interface JournalEntry {
  id: string;
  content: string;
  type: string;
  mood: string | null;
  tags: string[];
  createdAt: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function JournalPage() {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortalJournal()
      .then((data) => setEntries(data.entries))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-editorial text-text-primary">Journal</h1>
          <p className="text-sm text-text-secondary mt-1">Your thoughts, reflected.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-card p-6 animate-pulse">
              <div className="h-3 w-20 bg-background rounded mb-3" />
              <div className="h-4 w-full bg-background rounded mb-2" />
              <div className="h-4 w-3/4 bg-background rounded" />
            </div>
          ))}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-surface border border-border rounded-card p-12 text-center">
          <p className="text-text-secondary mb-2">No journal entries yet</p>
          <p className="text-sm text-text-disabled">Start writing in the Enso app to see your entries here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id} className="bg-surface border border-border rounded-card p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-text-disabled">{formatDate(entry.createdAt)}</span>
                <span className="text-xs text-text-disabled">·</span>
                <span className="text-xs text-text-disabled">{formatTime(entry.createdAt)}</span>
                {entry.mood && (
                  <>
                    <span className="text-xs text-text-disabled">·</span>
                    <span className="text-xs text-primary capitalize">{entry.mood}</span>
                  </>
                )}
              </div>
              <p className="text-text-primary leading-relaxed whitespace-pre-line">{entry.content}</p>
              {entry.tags.length > 0 && (
                <div className="flex gap-2 mt-3">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded-full">{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
