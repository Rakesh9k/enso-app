# Firestore Schema

## Root Collections

### users/{uid}
- email, displayName, photoURL
- subscriptionTier (FREE/PREMIUM/PRO)
- currentStreak, totalJournals
- themePreference, companion, room
- createdAt, updatedAt

### Subcollections
- daily_sessions/
- journal_entries/
- ai_reports/
- user_patterns/
- journey/stats
- journey_milestones/
- fcm_tokens/

### partner_profiles/{uid}
- partnerType, status, referralCode
- commissionRateBps
- balances, counters
- xp, level, levelName

### Subcollections
- ledger/
- payouts/
- rewards/
- academy/

### partner_referrals/{referredUserId}
- partnerId, status
- countsForCommission
- firstCheckInAt, day7At

### subscriptions/{eventId}
- RevenueCat webhook ledger (Admin SDK only)
