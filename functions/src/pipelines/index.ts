import * as functions from "firebase-functions";
export const scheduledWeeklyInsight = functions.pubsub.schedule("every monday 09:00").onRun(async () => { console.log("Weekly insight"); });
export const scheduledMonthlyInsight = functions.pubsub.schedule("every 1st 09:00").onRun(async () => { console.log("Monthly insight"); });
