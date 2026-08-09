import * as admin from "firebase-admin";
admin.initializeApp();

export { approvePartner, rejectPartner, suspendPartner, reinstatePartner, approvePayout, markPayoutPaid, failPayout, adjustPartnerLedger, unlinkFraudReferral, clearReferralReview, runPartnerJob } from "./partner/adminCallables";
export { getPartnerDashboard, getPartnerEligibility, acceptPartnerTerms, submitPartnerApplication, generateReferralCode, createCampaignCode, trackReferralClick, linkInviteToUser, requestPartnerPayout, claimPartnerReward, completeAcademyModule, setWarmIntro, setPartnerPaused, updatePayoutMethod } from "./partner/callables";
export { getRevenueCatPortalStatus } from "./partner/subscriptionPortal";
export { onDailySessionWritten, onJournalEntryWritten } from "./triggers";
export { processNotificationQueue } from "./notify";
export { scheduledWeeklyInsight, scheduledMonthlyInsight } from "./pipelines";
