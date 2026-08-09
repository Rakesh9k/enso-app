'use client';

export default function PartnerCommissionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Commissions</h1>
        <p className="text-text-secondary mt-1">Commission tracking and payout calculations</p>
      </div>

      <div className="bg-surface rounded-card border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Commission Tiers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-background rounded-card p-4 text-center">
            <p className="text-2xl font-semibold text-primary">10%</p>
            <p className="text-sm text-text-secondary">Starter (0-19 paid)</p>
          </div>
          <div className="bg-background rounded-card p-4 text-center">
            <p className="text-2xl font-semibold text-accent">15%</p>
            <p className="text-sm text-text-secondary">Growth (20-29 paid)</p>
          </div>
          <div className="bg-background rounded-card p-4 text-center">
            <p className="text-2xl font-semibold text-success">20%</p>
            <p className="text-sm text-text-secondary">Circle (30+ paid)</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-card border border-border p-12 text-center text-text-secondary text-sm">
        <p>Commission ledger will show all calculated commissions per partner, pending amounts, and payout history.</p>
      </div>
    </div>
  );
}
