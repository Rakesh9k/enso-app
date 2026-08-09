import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
const db = admin.firestore();
export const deleteUserAccount = onCall({ enforceAppCheck: false }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");
  await db.collection("users").doc(uid).set({ isDeleted: true, deletedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return { deleted: true };
});
export const deleteUserAccountWeb = onCall({ enforceAppCheck: false }, async (request) => {
  const uid = request.auth?.uid;
  if (!uid) throw new HttpsError("unauthenticated", "Sign in required.");
  await db.collection("users").doc(uid).set({ isDeleted: true, deletedAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
  return { deleted: true };
});
