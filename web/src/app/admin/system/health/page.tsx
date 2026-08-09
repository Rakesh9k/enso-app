'use client';

import { useEffect, useState } from 'react';
import { fetchSystemHealth } from '@/lib/admin-api';

interface HealthStatus {
  service: string;
  status: string;
  lastChecked: string;
  latencyMs: number;
}

export default function HealthPage() {
  const [services, setServices] = useState<HealthStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSystemHealth()
      .then((data) => setServices(data.services))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusIcon: Record<string, string> = { healthy: '✅', degraded: '⚠️', down: '❌' };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold text-text-primary">System Health</h1><p className="text-text-secondary mt-1">Service status and monitoring</p></div>

      <div className="bg-surface rounded-card border border-border overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="p-4 animate-pulse"><div className="h-10 bg-background rounded" /></div>)}</div>
        ) : services.length === 0 ? (
          <div className="p-12 text-center text-text-secondary text-sm">Health check data will appear here.</div>
        ) : (
          <div className="divide-y divide-border">
            {services.map((svc) => (
              <div key={svc.service} className="flex items-center gap-4 p-4">
                <span className="text-xl">{statusIcon[svc.status] || '❓'}</span>
                <div className="flex-1">
                  <p className="text-sm font-medium text-text-primary">{svc.service}</p>
                  <p className="text-xs text-text-secondary">{svc.latencyMs}ms · Last checked: {svc.lastChecked ? new Date(svc.lastChecked).toLocaleTimeString() : '-'}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${svc.status === 'healthy' ? 'bg-success/10 text-success' : svc.status === 'degraded' ? 'bg-warning/10 text-warning' : 'bg-danger/10 text-danger'}`}>{svc.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
