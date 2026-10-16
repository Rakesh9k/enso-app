# Enso Firebase access-control matrix

This is intended direct client access after the proposed rules. Admin SDK code bypasses Firebase Rules; callable functions must independently authenticate and authorize callers.

| Collection/path | Unauthenticated | Owner | Other signed-in user | Trusted server |
|---|---|---|---|---|
| users/{uid} | Deny | Read; create constrained free profile; update allowlisted preference/profile fields | Deny | Read/write |
| users/{uid}/journey/** and journey_milestones/events/progress | Deny | Read | Deny | Write |
| users/{uid}/daily_sessions, journal_entries, ai_reports, user_patterns, fcm_tokens | Deny | Read | Deny | Write |
| journalEntries/{id} | Deny | Read/create validated/update content-mood-tags/delete own | Deny | Read/write |
| meditationSessions/{id} | Deny | Read/create validated/delete own; no update | Deny | Read/write |
| aiInsights/{id} | Deny | Read | Deny | Write |
| userSubscriptions/{uid} | Deny | Read own record | Deny | Write |
| subscriptions/{eventId} | Deny | Deny | Deny | Read/write |
| dailyReflections/{uid_date} | Deny | Read/write validated own record | Deny | Read/write |
| roomProgress/{uid_roomId} | Deny | Read/write validated own record | Deny | Read/write |
| partners/{uid} | Deny | Read own legacy profile | Deny | Write |
| partner_profiles/{uid} and ledger/payouts/rewards/academy | Deny | Read own partner data | Deny | Write |
| partner_applications/{uid}, partner_activity/{uid}/events | Deny | Read own record | Deny | Write |
| partner_campaigns, partner_milestones | Deny | Read records where partnerId matches UID | Deny | Write |
| partner_referrals/clicks/codes/config/audit logs | Deny | Deny | Deny | Read/write |
| adminAuditLog, aiJobs, featureFlags, partnerApplications, partnerPayouts | Deny | Deny | Deny | Read/write |
| blogPosts | Deny direct client access; public content via callable | Callable response only | Callable response only | Read/write |
| notifications | Deny | Deny | Deny | Read/write |
| app_config/{id} | Read | Read | Read | Write |

## Authentication, App Check, authorization
- Authentication answers who the caller is (Firebase Auth UID).
- App Check helps verify requests originate from an attested app instance; it does not establish ownership or roles.
- Authorization is the resource/field decision in Rules or explicit callable checks.
- Verify App Check enforcement and registered providers in Firebase Console separately. Do not infer live App Check status from repository rules.
