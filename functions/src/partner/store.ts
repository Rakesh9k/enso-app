import { db } from "../config/firebase";
export const COL = { profiles: "partner_profiles", applications: "partner_applications", referrals: "partner_referrals", codes: "partner_codes", campaigns: "partner_campaigns", activity: "partner_activity", milestones: "partner_milestones", auditLogs: "partner_audit_logs", config: "partner_config" } as const;
export const SUB = { ledger: "ledger", payouts: "payouts", rewards: "rewards", academy: "academy" } as const;
export function profileRef(uid: string) { return db.collection(COL.profiles).doc(uid); }
export function codeRef(code: string) { return db.collection(COL.codes).doc(code); }
export function referralRef(referredUserId: string) { return db.collection(COL.referrals).doc(referredUserId); }
export async function readBalances(data: any) { return { availableMinor: Number(data?.balances?.availableMinor ?? 0), heldMinor: Number(data?.balances?.heldMinor ?? 0), pendingPayoutMinor: Number(data?.balances?.pendingPayoutMinor ?? 0), paidMinor: Number(data?.balances?.paidMinor ?? 0), lifetimeEarnedMinor: Number(data?.balances?.lifetimeEarnedMinor ?? 0), clawedBackMinor: Number(data?.balances?.clawedBackMinor ?? 0) }; }
export async function readCounters(data: any) { return { referrals: Number(data?.counters?.referrals ?? 0), activatedReferrals: Number(data?.counters?.activatedReferrals ?? 0), retainedReferrals: Number(data?.counters?.retainedReferrals ?? 0), payingReferrals: Number(data?.counters?.payingReferrals ?? 0), totalCheckIns: Number(data?.counters?.totalCheckIns ?? 0) }; }
export function applyBalanceDelta(balances: any, delta: any) {
  const next = { ...balances };
  for (const [k, v] of Object.entries(delta)) { if (typeof v === "number" && k in next) (next as any)[k] += v; }
  const aliases = { balanceAvailableMinor: next.availableMinor, balanceHeldMinor: next.heldMinor, balancePendingPayoutMinor: next.pendingPayoutMinor, balancePaidMinor: next.paidMinor };
  return { balances: next, aliases };
}
export function applyPartnerProgress(_: any) { return Promise.resolve(); }
export function recordPartnerActivity(_: any) { return Promise.resolve(); }
export async function writeAuditLog(log: any) { await db.collection(COL.auditLogs).add({ ...log, createdAt: admin.firestore.FieldValue.serverTimestamp() }); }
export async function loadPartnerConfig() { const snap = await db.collection(COL.config).doc("default").get(); return snap.data() ?? { defaultCurrency: "INR", starterRateBps: 1000, growthRateBps: 1500, circleRateBps: 2000 }; }
import * as admin from "firebase-admin";
