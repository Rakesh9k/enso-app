export const PARTNER_JOB_NAMES = ["releaseHeldCommissions", "calculateImpactScores", "expireRewards", "partnerInactivityNudges", "partnerFraudSweep"] as const;
export async function runPartnerJobByName(job: string): Promise<any> { return { job, processed: 0 }; }
