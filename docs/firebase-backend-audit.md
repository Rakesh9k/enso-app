# Enso Firebase backend audit and hardening

Reviewed repository Rakesh9k/enso-app, branch master, commit 51901392a9f1641008d57fdf05ad4d702db71100. Configured aliases in .firebaserc: default enso-prod-app, dev enso-dev-app. Repository changes only; live deployed configuration was not queried and no deployment/migration was performed.

## Findings
- Firestore rules allowed broad owner profile updates and broad user subcollection writes.
- Storage rules let every signed-in user read every object and write arbitrary paths.
- Composite index file was empty despite compound queries.
- Voice journals stored a Firebase download URL in Firestore, a bearer URL that Storage Rules alone cannot revoke.
- Account deletion only set an isDeleted marker, did not delete Auth, nested Firestore documents, or voice objects, and the callable was not exported from the Functions entry point.
- Some callable functions have enforceAppCheck false; Admin SDK bypasses Rules and callable authorization must be reviewed independently.
- Client entitlement reads users/{uid}.subscription; admin callable can update it. No RevenueCat webhook/entitlement synchronization implementation was found in the reviewed Functions entry point. Do not infer billing authority beyond this evidence.

## Collection inventory and schemas
- users/{uid}: email, displayName, photoURL, createdAt, lastLogin, subscription, admin, isPartner; schema notes include preferences, themePreference, companion, room, streak/count stats.
- journalEntries/{id}: uid, content, type, createdAt; optional audioPath/audioUrl, durationSeconds, mood, tags.
- meditationSessions/{id}: uid, durationSeconds, plannedMinutes, completed, createdAt.
- aiInsights/{id}: uid, title, description, type, createdAt; client read-only.
- userSubscriptions/{uid}: status, plan, amount, startDate, expiryDate, provider and userId referenced by admin code; client read-only.
- dailyReflections/{uid_date}: uid, date, createdAt plus question/answer/content/reflection/mood/source.
- roomProgress/{uid_roomId}: uid, roomId, updatedAt plus progress/completion/counter timestamps.
- Legacy user subcollections: daily_sessions, journal_entries, ai_reports, user_patterns, journey, journey_milestones, journey_events, journey_progress, fcm_tokens.
- Partner, referral, configuration, audit, subscription-ledger, notification, AI job, feature flag and blog collections are detailed in docs/firebase-backend-access-matrix.md and firestore.rules.

## Query-derived composite indexes
- journalEntries: uid ASC + createdAt DESC
- meditationSessions: uid ASC + createdAt DESC
- aiInsights: uid ASC + createdAt DESC
- users: subscription ASC + createdAt DESC
- userSubscriptions: status ASC + startDate DESC
- partners: status ASC + appliedAt DESC
- blogPosts: status ASC + createdAt DESC

## Ownership, schema and compatibility
New user documents must begin as free, non-admin, non-partner profiles. Client profile updates are allowlisted; entitlement/admin/partner fields and server-computed counters are not client writable. Journal and meditation creates validate uid, required fields, types and bounds. Financial/subscription and AI output writes are server-only. Read rules do not require historical documents to match new create schemas; inspect historical daily reflections and room progress for fields not in the allowlists before rollout. Existing voice records may contain audioUrl; new client writes store audioPath. Existing download-token URLs remain bearer URLs until revoked/rotated under an approved migration.

## Authentication, App Check, deletion
The account callable now attempts deletion of known user-owned records, nested user documents, partner user-keyed records and the private voice-journal prefix; it records partial failures in accountDeletionJobs/{uid}, and deletes Auth last so the caller can retry if earlier cleanup fails. The job record retains UID for operational status and needs a retention/anonymization policy. Unknown-schema and financial/legal records require review rather than blind deletion. App Check enforcement on deletion callables remains disabled for compatibility and must be resolved after provider registration is verified. Rules do not prove App Check is enabled in Console.

## Tests and limitations
Emulator rules tests are added under tests/firebase. The GitHub source-editing environment cannot run npm, Firebase Emulator Suite, Flutter or Functions build commands, so no test execution is claimed. Run the commands in docs/firebase-deployment-and-rollback.md locally/CI before approving deployment.
