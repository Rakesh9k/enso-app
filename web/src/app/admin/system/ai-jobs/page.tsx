'use client';

import { useEffect, useState } from 'react';

interface AIJob {
  id: string;
  type: string;
  status: string;
  startedAt: string;
  completedAt: string | null;
  error: string | null;
  progress: number;
}

export default function AIJobsPage() {
  const [jobs, setJobs] = useState<AIJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/ai')
      .then((r) => r.json())
      .then((data) => {
        if (data.ok) setJobs(data.jobs);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">AI Jobs</h1>
        <p className="text-text-secondary mt-1">Monitor AI pipeline execution</p>
      </div>

      <div className="bg-surface rounded-card border border-border overflow-hidden">
        {loading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse"><div className="h-10 bg-background rounded" /></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-text-secondary text-sm">No AI jobs found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-text-disabled font-medium">ID</th>
                  <th className="text-left p-4 text-text-disabled font-medium">Type</th>
                  <th className="text-left p-4 text-text-disabled font-medium">Status</th>
                  <th className="text-left p-4 text-text-disabled font-medium">Progress</th>
                  <th className="text-left p-4 text-text-disabled font-medium">Started</th>
                  <th className="text-left p-4 text-text-disabled font-medium">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-background/50">
                    <td className="p-4 text-text-primary font-mono text-xs">{job.id.slice(0, 8)}</td>
                    <td className="p-4 text-text-secondary">{job.type}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                        job.status === 'running' ? 'bg-primary/10 text-primary' :
                        job.status === 'completed' ? 'bg-success/10 text-success' :
                        job.status === 'failed' ? 'bg-danger/10 text-danger' :
                        'bg-warning/10 text-warning'
                      }`}>{job.status}</span>
                    </td>
                    <td className="p-4">
                      <div className="w-24 bg-background rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${job.progress}%` }} />
                      </div>
                    </td>
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
