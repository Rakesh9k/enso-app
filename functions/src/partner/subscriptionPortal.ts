import { onCall, HttpsError } from "firebase-functions/v2/https";
export const getRevenueCatPortalStatus = onCall({ enforceAppCheck: false }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) return { ok: false, message: "Not authenticated" };
  return { ok: true, tier: "FREE", isPremium: false, source: "unknown", managedBy: "UNKNOWN", manageUrl: null };
});
