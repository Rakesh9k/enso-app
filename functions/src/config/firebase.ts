import * as admin from "firebase-admin";
const db = admin.firestore();
const auth = admin.auth();
export { admin, db, auth };
