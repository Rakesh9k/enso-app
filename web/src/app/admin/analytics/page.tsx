'use client';

import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Analytics</h1>
        <p className="text-text-secondary mt-1">Platform metrics and user engagement data</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="bg-surface rounded-card border border-border p-5">
          <p className="text-2xl font-semibold text-primary">--</p>
          <p className="text-sm text-text-secondary">Daily Active Users</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-surface rounded-card border border-border p-5">
          <p className="text-2xl font-semibold text-accent">--</p>
          <p className="text-sm text-text-secondary">Weekly Active Users</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-surface rounded-card border border-border p-5">
          <p className="text-2xl font-semibold text-success">--</p>
          <p className="text-sm text-text-secondary">Avg. Session Duration</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-surface rounded-card border border-border p-5">
          <p className="text-2xl font-semibold text-warning">--</p>
          <p className="text-sm text-text-secondary">Retention (7-day)</p>
        </motion.div>
      </div>

      <div className="bg-surface rounded-card border border-border p-12 text-center text-text-secondary text-sm">
        <p>Analytics dashboards will be populated with real data as the platform scales.</p>
        <p className="mt-2">Key metrics tracked: DAU/WAU/MAU, session duration, feature adoption, retention curves, conversion funnels, room usage distribution.</p>
      </div>
    </div>
  );
}
