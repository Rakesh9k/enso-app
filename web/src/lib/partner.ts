import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';

// Partner callables
export const getPartnerDashboard = httpsCallable(functions, 'getPartnerDashboard');
export const getPartnerEligibility = httpsCallable(functions, 'getPartnerEligibility');
export const acceptPartnerTerms = httpsCallable(functions, 'acceptPartnerTerms');
export const submitPartnerApplication = httpsCallable(functions, 'submitPartnerApplication');
export const generateReferralCode = httpsCallable(functions, 'generateReferralCode');
export const createCampaignCode = httpsCallable(functions, 'createCampaignCode');
export const trackReferralClick = httpsCallable(functions, 'trackReferralClick');
export const linkInviteToUser = httpsCallable(functions, 'linkInviteToUser');
export const requestPartnerPayout = httpsCallable(functions, 'requestPartnerPayout');
export const claimPartnerReward = httpsCallable(functions, 'claimPartnerReward');
export const completeAcademyModule = httpsCallable(functions, 'completeAcademyModule');
export const setWarmIntro = httpsCallable(functions, 'setWarmIntro');
export const setPartnerPaused = httpsCallable(functions, 'setPartnerPaused');
export const updatePayoutMethod = httpsCallable(functions, 'updatePayoutMethod');
