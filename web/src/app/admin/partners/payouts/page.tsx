'use client';

export default function PartnerPayoutsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Payouts</h1>
        <p className="text-text-secondary mt-1">Manage partner payouts and payment processing</p>
      </div>

      <div className="bg-surface rounded-card border border-border p-6 space-y-4">
        <h3 className="text-lg font-semibold text-text-primary">Payout Rules</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="bg-background rounded-card p-4">
            <p className="text-text-disabled">Minimum Payout</p>
            <p className="text-lg font-semibold text-text-primary">₹2,000</p>
          </div>
          <div className="bg-background rounded-card p-4">
            <p className="text-text-disabled">Minimum Referrals</p>
            <p className="text-lg font-semibold text-text-primary">3 paid</p>
          </div>
          <div className="bg-background rounded-card p-4">
            <p className="text-text-disabled">Validation Hold</p>
            <p className="text-lg font-semibold text-text-primary">30 days</p>
          </div>
          <div className="bg-background rounded-card p-4">
            <p className="text-text-disabled">Payout Frequency</p>
            <p className="text-lg font-semibold text-text-primary">Monthly</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-card border border-border p-12 text-center text-text-secondary text-sm">
        <p>Payout queue will show all pending and processed payouts with partner details and payment method.</p>
      </div>
    </div>
  );
}
