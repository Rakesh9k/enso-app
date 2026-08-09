'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { fetchAIJobs } from '@/lib/admin-api';

interface AIJob {
  id: string;
  type: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  error: string | null;
  progress: number;
}

export default function AIPage() {
  const [jobs, setJobs] = useState<AIJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAIJobs()
      .then((data) => setJobs(data.jobs))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stats = {
    total: jobs.length,
    running: jobs.filter((j) => j.status === 'running').length,
    queued: jobs.filter((j) => j.status === 'queued').length,
    failed: jobs.filter((j) => j.status === 'failed').length,
  };

  const statusColors: Record<string, string> = {
    running: 'bg-primary/10 text-primary', queued: 'bg-warning/10 text-warning',
    completed: 'bg-success/10 text-success', failed: 'bg-danger/10 text-danger',
  };

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-semibold text-text-primary">AI & Insights</h1><p className="text-text-secondary mt-1">Monitor AI job queue and insight generation</p></div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-primary">{stats.total}</p><p className="text-sm text-text-secondary">Total Jobs</p></motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-primary">{stats.running}</p><p className="text-sm text-text-secondary">Running</p></motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-warning">{stats.queued}</p><p className="text-sm text-text-secondary">Queued</p></motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-surface rounded-card border border-border p-5"><p className="text-2xl font-semibold text-danger">{stats.failed}</p><p className="text-sm text-text-secondary">Failed</p></motion.div>
      </div>

      <div className="bg-surface rounded-card border border-border overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="p-4 animate-pulse"><div className="h-10 bg-background rounded" /></div>)}</div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-text-secondary text-sm">No AI jobs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border">
                <th className="text-left p-4 text-text-disabled font-medium">Job ID</th>
                <th className="text-left p-4 text-text-disabled font-medium">Type</th>
                <th className="text-left p-4 text-text-disabled font-medium">Status</th>
                <th className="text-left p-4 text-text-disabled font-medium">Progress</th>
                <th className="text-left p-4 text-text-disabled font-medium">Started</th>
                <th className="text-left p-4 text-text-disabled font-medium">Error</th>
              </tr></thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-background/50">
                    <td className="p-4 text-text-primary font-mono text-xs">{job.id.slice(0, 8)}</td>
                    <td className="p-4 text-text-secondary">{job.type}</td>
                    <td className="p-4"><span className={`px-2 py-0.5 text-xs font-medium rounded-full ${statusColors[job.status] || ''}`}>{job.status}</span></td>
                    <td className="p-4"><div className="w-24 bg-background rounded-full h-2"><div className="bg-primary h-2 rounded-full" style={{ width: `${job.progress}%` }} /></div></td>
                    <td className="p-4 text-text-secondary">{job.startedAt ? new Date(job.startedAt).toLocaleString() : '-'}</td>
                    <td className="p-4 text-danger text-xs max-w-48 truncate">{job.error || '-'}</td>
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
