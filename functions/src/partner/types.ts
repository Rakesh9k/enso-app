export const PARTNER_SCHEMA_VERSION = 1;
export const ZERO_BALANCES = { availableMinor: 0, heldMinor: 0, pendingPayoutMinor: 0, paidMinor: 0, lifetimeEarnedMinor: 0, clawedBackMinor: 0 };
export const ZERO_COUNTERS = { referrals: 0, activatedReferrals: 0, retainedReferrals: 0, payingReferrals: 0, totalCheckIns: 0 };
export function balanceAliases(b: typeof ZERO_BALANCES) { return { balanceAvailableMinor: b.availableMinor, balanceHeldMinor: b.heldMinor, balancePendingPayoutMinor: b.pendingPayoutMinor, balancePaidMinor: b.paidMinor }; }
