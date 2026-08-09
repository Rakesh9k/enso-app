export type PartnerType = 'INFLUENCER' | 'THERAPIST' | 'COACH';
export type PartnerStatus = 'ACTIVE' | 'SUSPENDED' | 'DEACTIVATED';
export type ApplicationStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
export type ReferralStatus = 'CLICKED' | 'SIGNED_UP' | 'FIRST_CHECK_IN' | 'DAY_7_RETAINED' | 'SUBSCRIBED' | 'FRAUD_REVIEW' | 'FRAUD_UNLINKED';
export type LedgerEntryType = 'COMMISSION' | 'ADJUSTMENT' | 'BONUS';
export type LedgerEntryStatus = 'HELD' | 'AVAILABLE' | 'PAID' | 'CLAWED_BACK';
export type PayoutStatus = 'PENDING' | 'APPROVED' | 'PROCESSING' | 'PAID' | 'FAILED' | 'REVERSED';
export type RewardStatus = 'AVAILABLE' | 'CLAIMED' | 'EXPIRED';

export interface ImpactBand {
  minReferrals: number;
  maxReferrals: number | null;
  label: string;
}

export const PARTNER_TIERS: ImpactBand[] = [
  { minReferrals: 0, maxReferrals: 19, label: 'Starter' },
  { minReferrals: 20, maxReferrals: 29, label: 'Growth' },
  { minReferrals: 30, maxReferrals: null, label: 'Circle' },
];

export const COMMISSION_RATES: Record<string, number> = {
  Starter: 10,
  Growth: 15,
  Circle: 20,
};

export interface PartnerProfile {
  uid: string;
  partnerType: PartnerType;
  status: PartnerStatus;
  displayName: string;
  referralCode: string;
  commissionRateBps: number;
  commissionRate: number;
  balances: PartnerBalances;
  counters: PartnerCounters;
  xp: number;
  level: number;
  levelName: string;
  chapter: number;
  impactScore: number;
  openPayoutId: string | null;
  approvedAt: Date | null;
  lastActivityAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PartnerBalances {
  availableMinor: number;
  heldMinor: number;
  pendingPayoutMinor: number;
  paidMinor: number;
  lifetimeEarnedMinor: number;
  clawedBackMinor: number;
}

export interface PartnerCounters {
  referrals: number;
  activatedReferrals: number;
  retainedReferrals: number;
  payingReferrals: number;
  totalCheckIns: number;
}

export interface PartnerReferral {
  id: string;
  partnerId: string;
  referredUserId: string;
  status: ReferralStatus;
  countsForCommission: boolean;
  needsReview: boolean;
  firstCheckInAt: Date | null;
  day7At: Date | null;
  subscriptionStatus: string;
  createdAt: Date;
}

export interface PartnerLedgerEntry {
  id: string;
  type: LedgerEntryType;
  status: LedgerEntryStatus;
  amountMinor: number;
  currency: string;
  reason: string;
  referredUserId: string | null;
  createdAt: Date;
}

export interface PartnerPayout {
  id: string;
  status: PayoutStatus;
  amountMinor: number;
  transactionReference: string | null;
  approvedAt: Date | null;
  paidAt: Date | null;
  createdAt: Date;
}

export interface PartnerReward {
  id: string;
  status: RewardStatus;
  title: string;
  description: string;
  claimedAt: Date | null;
  expiresAt: Date | null;
}

export interface PartnerActivity {
  id: string;
  type: string;
  params: Record<string, unknown>;
  createdAt: Date;
}

export interface PartnerDashboard {
  profile: PartnerProfile;
  recentActivity: PartnerActivity[];
  pendingPayout: PartnerPayout | null;
}
