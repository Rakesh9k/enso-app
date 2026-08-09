export interface AdminStats {
  totalUsers: number;
  freeUsers: number;
  premiumUsers: number;
  totalPartners: number;
  activePartners: number;
  pendingApplications: number;
  monthlyRevenue: number;
  activeSubscriptions: number;
  totalJournalEntries: number;
  totalMeditationMinutes: number;
  aiInsightsGenerated: number;
  aiJobsRunning: number;
  pendingPayouts: number;
  totalPayoutsProcessed: number;
}

export interface AdminUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  lastLogin: string | null;
  subscription: string;
  subscriptionExpiry: string | null;
  isAdmin: boolean;
  isPartner: boolean;
  partnerId: string | null;
  journalCount: number;
  meditationMinutes: number;
  lastActive: string | null;
}

export interface AdminPartner {
  id: string;
  partnerUid: string;
  partnerName: string;
  partnerEmail: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended' | 'pending_cancellation' | 'cancelled' | 'payout_hold' | 'inactive';
  appliedAt: string;
  approvedAt: string | null;
  suspendedAt: string | null;
  rejectionReason: string | null;
  referralCode: string;
  totalReferrals: number;
  paidReferrals: number;
  pendingPayout: number;
  totalPaid: number;
  level: number;
}

export interface AdminPayout {
  id: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  processedAt: string | null;
  method: 'upi' | 'bank_transfer';
}

export interface AdminAuditLog {
  id: string;
  action: string;
  adminUid: string;
  adminEmail: string;
  targetUid?: string;
  targetPartnerId?: string;
  details: Record<string, unknown>;
  timestamp: string;
  ipAddress: string;
}

export interface AdminHealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  lastChecked: string;
  latencyMs: number;
  details?: string;
}

export interface AdminAIJob {
  id: string;
  type: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt: string | null;
  error: string | null;
  progress: number;
}

export interface AdminFeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  allowedUsers: string[];
  createdAt: string;
  updatedAt: string;
}

export type AdminSection =
  | 'dashboard'
  | 'users'
  | 'subscriptions'
  | 'ai'
  | 'partners'
  | 'content'
  | 'analytics'
  | 'system'
  | 'settings';
