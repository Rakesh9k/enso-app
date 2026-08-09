'use client';

import { useState, useEffect } from 'react';

interface MoodTimelineProps {
  className?: string;
}

export default function MoodTimeline({ className = '' }: MoodTimelineProps) {
  const [entries, setEntries] = useState<{ date: string; theme: string }[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('enso_theme_history');
      if (stored) {
        const parsed = JSON.parse(stored);
        setEntries(parsed.slice(-30));
      }
    } catch {}
  }, []);

  if (entries.length === 0) {
    return (
      <div className={`text-center py-8 text-text-disabled text-sm ${className}`}>
        No mood data yet. Start journaling to see your timeline.
      </div>
    );
  }

  return (
    <div className={`flex items-end gap-1 h-16 ${className}`}>
      {entries.map((entry, i) => (
        <div
          key={i}
          className="flex-1 rounded-t bg-primary/30 hover:bg-primary/50 transition-colors"
          style={{ height: `${30 + Math.random() * 70}%` }}
          title={`${entry.date}: ${entry.theme}`}
        />
      ))}
    </div>
  );
}
