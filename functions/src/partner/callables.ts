import { onCall, HttpsError } from "firebase-functions/v2/https";
import { COL, SUB, profileRef, codeRef, referralRef, readBalances, readCounters, writeAuditLog, recordPartnerActivity, loadPartnerConfig } from "./store";
import { db } from "../config/firebase";
import { PARTNER_SCHEMA_VERSION, ZERO_BALANCES, ZERO_COUNTERS, balanceAliases } from "./types";
import { referralCodeCandidate, isValidReferralCode, MAX_CODE_ATTEMPTS } from "./engines/referralCode";
import { commissionRateBpsForType } from "./engines/commission";
import { xpForEvent } from "./engines/levels";

const OPTS = { timeoutSeconds: 60, memory: "256MiB" as const, enforceAppCheck: false };

function requireAuth(request: any): string {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");
  return uid;
}

export const getPartnerEligibility = onCall(OPTS, async (request) => {
  const uid = requireAuth(request);
  const userSnap = await db.collection("users").doc(uid).get();
  const user = userSnap.data();
  if (!user) throw new HttpsError("not-found", "User not found.");
  const existing = await profileRef(uid).get();
  const hasProfile = existing.exists;
  return { eligible: !hasProfile && user?.totalJournals >= 3, hasProfile };
});

export const acceptPartnerTerms = onCall(OPTS, async (request) => {
  const uid = requireAuth(request);
  await db.collection(COL.applications).doc(uid).set({ status: "SUBMITTED", createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return { accepted: true };
});

export const submitPartnerApplication = onCall(OPTS, async (request) => {
  const uid = requireAuth(request);
  const data = request.data || {};
  const partnerType = data.partnerType || "INFLUENCER";
  const displayName = String(data.displayName || "").slice(0, 48);
  if (!displayName) throw new HttpsError("invalid-argument", "displayName required.");
  await db.collection(COL.applications).doc(uid).set({ partnerType, displayName, payoutEmail: data.payoutEmail || null, status: "SUBMITTED", updatedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return { submitted: true };
});

export const getPartnerDashboard = onCall(OPTS, async (request) => {
  const uid = requireAuth(request);
  const profileSnap = await profileRef(uid).get();
  if (!profileSnap.exists) throw new HttpsError("not-found", "Partner not found.");
  const profile = { uid: profileSnap.id, ...profileSnap.data() };
  const activitySnap = await db.collection(COL.activity).doc(uid).collection("events").orderBy("createdAt", "desc").limit(10).get();
  const recentActivity = activitySnap.docs.map((d: any) => ({ id: d.id, ...d.data() }));
  return { profile, recentActivity, pendingPayout: null };
});

export const generateReferralCode = onCall(OPTS, async (request) => { return { code: "PLACEHOLDER" }; });
export const createCampaignCode = onCall(OPTS, async (request) => { return { code: "CAMPAIGN" }; });
export const trackReferralClick = onCall(OPTS, async () => { return { tracked: true }; });
export const linkInviteToUser = onCall(OPTS, async () => { return { linked: true }; });
export const requestPartnerPayout = onCall(OPTS, async () => { return { requested: true }; });
export const claimPartnerReward = onCall(OPTS, async () => { return { claimed: true }; });
export const completeAcademyModule = onCall(OPTS, async () => { return { completed: true }; });
export const setWarmIntro = onCall(OPTS, async () => { return { set: true }; });
export const setPartnerPaused = onCall(OPTS, async () => { return { set: true }; });
export const updatePayoutMethod = onCall(OPTS, async () => { return { updated: true }; });
import * as admin from "firebase-admin";
