'use client';

import { useEffect, useState } from 'react';
import { fetchPortalInsights } from '@/lib/admin-api';

interface Insight {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [summary, setSummary] = useState({ totalJournals: 0, totalMeditationSessions: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortalInsights()
      .then((data) => {
        setInsights(data.insights);
        setSummary(data.summary);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const typeIcons: Record<string, string> = {
    pattern: '🧠',
    growth: '📈',
    mood: '😊',
    habit: '🔄',
    reflection: '💭',
  };

  return (
    <div>
      <h1 className="text-2xl font-editorial text-text-primary mb-2">Insights</h1>
      <p className="text-sm text-text-secondary mb-8">Patterns and growth from your practice.</p>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-card p-5 text-center">
          <p className="text-2xl font-semibold text-primary">{summary.totalJournals}</p>
          <p className="text-sm text-text-secondary">Journal Entries</p>
        </div>
        <div className="bg-surface border border-border rounded-card p-5 text-center">
          <p className="text-2xl font-semibold text-accent">{summary.totalMeditationSessions}</p>
          <p className="text-sm text-text-secondary">Meditation Sessions</p>
        </div>
      </div>

      {/* Insights */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-card p-6 animate-pulse">
              <div className="h-4 w-48 bg-background rounded mb-2" />
              <div className="h-3 w-full bg-background rounded" />
            </div>
          ))}
        </div>
      ) : insights.length === 0 ? (
        <div className="bg-surface border border-border rounded-card p-12 text-center">
          <p className="text-text-secondary mb-2">No insights yet</p>
          <p className="text-sm text-text-disabled">Write a few journal entries and meditate to unlock AI-powered insights about your patterns.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.map((insight) => (
            <div key={insight.id} className="bg-surface border border-border rounded-card p-6">
              <div className="flex items-start gap-3">
                <span className="text-xl">{typeIcons[insight.type] || '💡'}</span>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-text-primary mb-1">{insight.title}</h3>
                  <p className="text-sm text-text-secondary">{insight.description}</p>
                  {insight.createdAt && (
                    <p className="text-xs text-text-disabled mt-2">
                      {new Date(insight.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
