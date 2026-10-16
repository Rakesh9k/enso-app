import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";

const db = admin.firestore();
const storage = admin.storage();
type Failure = { resource: string; message: string };

async function deleteQuery(collectionName: string, field: string, uid: string): Promise<void> {
  const snapshot = await db.collection(collectionName).where(field, "==", uid).get();
  for (let offset = 0; offset < snapshot.docs.length; offset += 400) {
    const batch = db.batch();
    snapshot.docs.slice(offset, offset + 400).forEach((doc) => batch.delete(doc.ref));
    await batch.commit();
  }
}

async function deleteUserData(uid: string): Promise<Failure[]> {
  const failures: Failure[] = [];
  const attempt = async (resource: string, work: () => Promise<unknown>) => {
    try { await work(); } catch (error) {
      failures.push({ resource, message: error instanceof Error ? error.message : "Unknown cleanup error" });
    }
  };
  await attempt("users tree", async () => db.recursiveDelete(db.collection("users").doc(uid)));
  for (const name of ["journalEntries", "meditationSessions", "aiInsights", "dailyReflections", "roomProgress"]) {
    await attempt(name, () => deleteQuery(name, "uid", uid));
  }
  for (const name of ["userSubscriptions", "partners", "partner_profiles", "partner_applications", "partner_activity"]) {
    await attempt(name, async () => db.recursiveDelete(db.collection(name).doc(uid)));
  }
  await attempt("partner_campaigns", () => deleteQuery("partner_campaigns", "partnerId", uid));
  await attempt("partner_milestones", () => deleteQuery("partner_milestones", "partnerId", uid));
  for (const name of ["partner_referrals", "partner_clicks"]) {
    await attempt(name, async () => db.recursiveDelete(db.collection(name).doc(uid)));
  }
  await attempt("voice audio", async () => storage.bucket().deleteFiles({ prefix: `voice_journals/${uid}/` }));
  return failures;
}

export async function deleteAccountDataForUid(uid: string): Promise<{ deleted: true }> {
  const jobRef = db.collection("accountDeletionJobs").doc(uid);
  await jobRef.set({
    uid, status: "processing",
    startedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  const failures = await deleteUserData(uid);
  if (failures.length) {
    await jobRef.set({
      status: "partial_failure", failures,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    throw new HttpsError("internal", "Account deletion is incomplete. Retry or contact support with the deletion request reference.", {
      partial: true, failedResources: failures.map((failure) => failure.resource),
    });
  }

  // Delete Auth last so a signed-in user can retry if any preceding cleanup fails.
  try {
    await admin.auth().deleteUser(uid);
  } catch (error) {
    await jobRef.set({
      status: "auth_deletion_failed",
      authFailure: error instanceof Error ? error.message : "Unknown Auth deletion error",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    throw new HttpsError("internal", "User data was removed, but Authentication deletion failed. Please retry or contact support.");
  }

  await jobRef.set({
    status: "completed",
    completedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    failures: admin.firestore.FieldValue.delete(),
    authFailure: admin.firestore.FieldValue.delete(),
  }, { merge: true });
  return { deleted: true };
}

export const deleteUserAccount = onCall({ enforceAppCheck: false, timeoutSeconds: 540 }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");
  return deleteAccountDataForUid(uid);
});

export const deleteUserAccountWeb = onCall({ enforceAppCheck: false, timeoutSeconds: 540 }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");
  return handleAccountDeletion(uid);
});
