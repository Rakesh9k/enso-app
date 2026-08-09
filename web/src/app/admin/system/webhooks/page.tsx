'use client';

export default function WebhooksPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Webhooks</h1>
        <p className="text-text-secondary mt-1">Manage webhook endpoints</p>
      </div>

      <div className="bg-surface rounded-card border border-border p-12 text-center text-text-secondary text-sm">
        <p>Webhook configuration will be available here.</p>
        <p className="mt-2">Configure endpoints for Google Play, Razorpay, and custom integrations.</p>
      </div>
    </div>
  );
}
