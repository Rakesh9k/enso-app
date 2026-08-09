'use client';

export default function PartnerReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Referrals</h1>
        <p className="text-text-secondary mt-1">Track referral codes and usage across partners</p>
      </div>

      <div className="bg-surface rounded-card border border-border p-12 text-center text-text-secondary text-sm">
        <p>Referral tracking dashboard will show all active referral codes, usage counts, and conversion rates.</p>
        <p className="mt-2">Data is sourced from the <code>partnerReferrals</code> collection in Firestore.</p>
      </div>
    </div>
  );
}
