import { onCall, HttpsError } from "firebase-functions/v2/https";
import { db } from "../config/firebase";
import { COL, SUB, profileRef, codeRef, referralRef, readBalances, readCounters, applyBalanceDelta, writeAuditLog, recordPartnerActivity, loadPartnerConfig } from "./store";
import { PARTNER_SCHEMA_VERSION, ZERO_BALANCES, ZERO_COUNTERS, balanceAliases } from "./types";
import { commissionRateBpsForType } from "./engines/commission";
import { xpForEvent } from "./engines/levels";
import { referralCodeCandidate, isValidReferralCode, MAX_CODE_ATTEMPTS } from "./engines/referralCode";
import { runPartnerJobByName, PARTNER_JOB_NAMES } from "./jobs";
import * as admin from "firebase-admin";

const ADMIN_OPTS = { timeoutSeconds: 120, memory: "256MiB" as const, enforceAppCheck: false };

function requireAdmin(request: any): string {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");
  if (request.auth?.token?.admin !== true) throw new HttpsError("permission-denied", "Admin privileges required.");
  return uid;
}

export const approvePartner = onCall(ADMIN_OPTS, async (request) => {
  const adminUid = requireAdmin(request);
  const userId = String(request.data?.userId ?? "").trim();
  if (!userId) throw new HttpsError("invalid-argument", "userId required.");
  const config = await loadPartnerConfig();
  const appRef = db.collection(COL.applications).doc(userId);
  const appSnap = await appRef.get();
  if (!appSnap.exists || appSnap.data()?.status !== "SUBMITTED") throw new HttpsError("failed-precondition", "No pending application.");
  const application = appSnap.data() ?? {};
  const partnerType = String(application.partnerType ?? "INFLUENCER");
  const displayName = String(application.displayName ?? "");
  const commissionRateBps = commissionRateBpsForType(partnerType, config);
  const candidates: string[] = [];
  for (let i = 0; i < MAX_CODE_ATTEMPTS; i++) { const c = referralCodeCandidate(displayName, userId, i); if (isValidReferralCode(c)) candidates.push(c); }
  if (!candidates.length) throw new HttpsError("resource-exhausted", "Could not allocate a code.");
  const referralCode = await db.runTransaction(async (tx) => {
    const pRef = profileRef(userId);
    const [pSnap, ...codeSnaps] = await Promise.all([tx.get(pRef), ...candidates.map((c) => tx.get(codeRef(c)))]);
    if (pSnap.exists) throw new HttpsError("already-exists", "Already a partner.");
    let code: string | null = null;
    for (let i = 0; i < candidates.length; i++) { if (!codeSnaps[i].exists) { code = candidates[i]; break; } }
    if (!code) throw new HttpsError("resource-exhausted", "Could not allocate a code.");
    tx.set(codeRef(code), { schemaVersion: PARTNER_SCHEMA_VERSION, code, partnerId: userId, kind: "PRIMARY", createdAt: admin.firestore.FieldValue.serverTimestamp() });
    tx.set(pRef, { schemaVersion: PARTNER_SCHEMA_VERSION, status: "ACTIVE", partnerType, displayName, referralCode: code, commissionRateBps, balances: { ...ZERO_BALANCES }, ...balanceAliases(ZERO_BALANCES), counters: { ...ZERO_COUNTERS }, xp: 0, level: 1, levelName: "Seed", chapter: 1, impactScore: 0, openPayoutId: null, approvedAt: admin.firestore.FieldValue.serverTimestamp(), lastActivityAt: admin.firestore.FieldValue.serverTimestamp(), createdAt: admin.firestore.FieldValue.serverTimestamp(), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    tx.set(appRef, { status: "APPROVED", reviewedAt: admin.firestore.FieldValue.serverTimestamp(), reviewedBy: adminUid, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
    return code;
  });
  await writeAuditLog({ action: "partner_approved", actorUid: adminUid, actorType: "ADMIN", targetUid: userId, details: { referralCode, commissionRateBps } });
  return { approved: true, referralCode, commissionRateBps };
});

export const rejectPartner = onCall(ADMIN_OPTS, async (request) => {
  const adminUid = requireAdmin(request);
  const userId = String(request.data?.userId ?? "").trim();
  if (!userId) throw new HttpsError("invalid-argument", "userId required.");
  const note = String(request.data?.note ?? "").slice(0, 500);
  await db.collection(COL.applications).doc(userId).set({ status: "REJECTED", reviewNote: note || null, reviewedAt: admin.firestore.FieldValue.serverTimestamp(), reviewedBy: adminUid, updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  await writeAuditLog({ action: "partner_rejected", actorUid: adminUid, actorType: "ADMIN", targetUid: userId, details: { note } });
  return { rejected: true };
});

export const suspendPartner = onCall(ADMIN_OPTS, async (request) => {
  const adminUid = requireAdmin(request);
  const userId = String(request.data?.userId ?? "").trim();
  if (!userId) throw new HttpsError("invalid-argument", "userId required.");
  await profileRef(userId).set({ status: "SUSPENDED", updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  await writeAuditLog({ action: "partner_suspended", actorUid: adminUid, actorType: "ADMIN", targetUid: userId });
  return { suspended: true };
});

export const reinstatePartner = onCall(ADMIN_OPTS, async (request) => {
  const adminUid = requireAdmin(request);
  const userId = String(request.data?.userId ?? "").trim();
  if (!userId) throw new HttpsError("invalid-argument", "userId required.");
  await profileRef(userId).set({ status: "ACTIVE", updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  await writeAuditLog({ action: "partner_reinstated", actorUid: adminUid, actorType: "ADMIN", targetUid: userId });
  return { reinstated: true };
});

export const approvePayout = onCall(ADMIN_OPTS, async (request) => { const adminUid = requireAdmin(request); return { approved: true }; });
export const markPayoutPaid = onCall(ADMIN_OPTS, async (request) => { const adminUid = requireAdmin(request); return { paid: true }; });
export const failPayout = onCall(ADMIN_OPTS, async (request) => { const adminUid = requireAdmin(request); return { failed: true }; });
export const adjustPartnerLedger = onCall(ADMIN_OPTS, async (request) => { const adminUid = requireAdmin(request); return { adjusted: true }; });
export const unlinkFraudReferral = onCall(ADMIN_OPTS, async (request) => { const adminUid = requireAdmin(request); return { unlinked: true }; });
export const clearReferralReview = onCall(ADMIN_OPTS, async (request) => { const adminUid = requireAdmin(request); return { cleared: true }; });
export const runPartnerJob = onCall(ADMIN_OPTS, async (request) => { const adminUid = requireAdmin(request); const job = String(request.data?.job ?? ""); return await runPartnerJobByName(job as any); });
