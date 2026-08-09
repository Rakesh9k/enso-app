import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
const db = admin.firestore();
export const onDailySessionWritten = functions.firestore.document("users/{uid}/daily_sessions/{sid}").onCreate(async (snap, context) => { console.log("Daily session created:", context.params.uid); });
export const onJournalEntryWritten = functions.firestore.document("users/{uid}/journal_entries/{jid}").onCreate(async (snap, context) => { console.log("Journal entry created:", context.params.uid); });
