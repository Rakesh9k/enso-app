'use client';

import { useEffect, useState } from 'react';
import { fetchAuditLogs } from '@/lib/admin-api';

interface AuditLog {
  id: string;
  action: string;
  adminEmail: string;
  targetUid?: string;
  details: Record<string, unknown>;
  timestamp: string;
  ipAddress: string;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAuditLogs()
      .then((data) => setLogs(data.logs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold text-text-primary">Audit Logs</h1><p className="text-text-secondary mt-1">Admin action history</p></div>

      <div className="bg-surface rounded-card border border-border overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="p-4 animate-pulse"><div className="h-10 bg-background rounded" /></div>)}</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-text-secondary text-sm">No audit logs yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left p-4 text-text-disabled font-medium">Time</th>
                <th className="text-left p-4 text-text-disabled font-medium">Action</th>
                <th className="text-left p-4 text-text-disabled font-medium">Admin</th>
                <th className="text-left p-4 text-text-disabled font-medium">Target</th>
                <th className="text-left p-4 text-text-disabled font-medium">IP</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-background/50">
                    <td className="p-4 text-text-secondary">{log.timestamp ? new Date(log.timestamp).toLocaleString() : '-'}</td>
                    <td className="p-4 text-text-primary font-mono text-xs">{log.action}</td>
                    <td className="p-4 text-text-secondary">{log.adminEmail}</td>
                    <td className="p-4 text-text-secondary font-mono text-xs">{log.targetUid || '-'}</td>
                    <td className="p-4 text-text-disabled text-xs">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
