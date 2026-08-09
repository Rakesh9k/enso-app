import * as functions from "firebase-functions";
export const processNotificationQueue = functions.pubsub.schedule("every 5 minutes").onRun(async () => { console.log("Processing notification queue"); });
