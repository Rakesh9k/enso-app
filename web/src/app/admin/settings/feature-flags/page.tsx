'use client';

import { useEffect, useState } from 'react';
import { fetchFeatureFlags, updateFeatureFlag } from '@/lib/admin-api';

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
}

export default function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatureFlags()
      .then((data) => setFlags(data.flags))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (id: string, enabled: boolean) => {
    try {
      await updateFeatureFlag(id, { enabled });
      setFlags((prev) => prev.map((f) => (f.id === id ? { ...f, enabled } : f)));
    } catch {}
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold text-text-primary">Feature Flags</h1><p className="text-text-secondary mt-1">Control feature rollout and visibility</p></div>

      <div className="bg-surface rounded-card border border-border overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="p-4 animate-pulse"><div className="h-10 bg-background rounded" /></div>)}</div>
        ) : flags.length === 0 ? (
          <div className="p-12 text-center text-text-secondary text-sm">No feature flags configured</div>
        ) : (
          <div className="divide-y divide-border">
            {flags.map((flag) => (
              <div key={flag.id} className="flex items-center gap-4 p-4">
                <div className="flex-1"><p className="text-sm font-medium text-text-primary">{flag.name}</p><p className="text-xs text-text-secondary">{flag.description}</p></div>
                <div className="text-right"><p className="text-xs text-text-disabled">{flag.rolloutPercentage}% rollout</p></div>
                <button onClick={() => handleToggle(flag.id, !flag.enabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${flag.enabled ? 'bg-success' : 'bg-text-disabled/30'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${flag.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
