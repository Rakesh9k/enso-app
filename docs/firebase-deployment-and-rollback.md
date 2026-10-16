# Enso Firebase deployment and rollback runbook

## Not performed by this change
No Firebase rules, indexes, functions, data or Console configuration have been deployed or modified. Repository aliases show enso-prod-app as default and enso-dev-app as dev; do not deploy without an explicit project flag.

## Pre-deploy
1. Confirm owner approval for the exact project ID and exact resources.
2. Back up deployed Firestore rules, Storage rules and index configuration; record current index state.
3. Inspect existing documents for field variants and voice-journal download tokens. Existing audio download URLs are bearer URLs; Storage Rules alone do not revoke them.
4. Run locally/CI:
   - cd tests/firebase && npm install
   - npm run test:firestore
   - npm run test:storage
   - cd ../../functions && npm install && npm run build
   - cd .. && flutter analyze && flutter test
5. Test only against the Emulator Suite/demo project, never production.
6. Review every client field write against allowlists and inspect old records before stricter rules are deployed.

## Development rollout (only after separate approval)
```sh
firebase use enso-dev-app
firebase deploy --only firestore:rules,firestore:indexes --project enso-dev-app
firebase deploy --only storage --project enso-dev-app
```
Deploy Functions separately only after their code/tests and IAM are reviewed. Test signup, existing account, profile preferences, journal CRUD, meditation CRUD, audio upload/read/delete, daily reflection, room progress, deletion, and two-user isolation.

## Production rollout
Production rollout requires explicit approval after dev tests and a compatible client release. The current client has been changed to write audioPath rather than a new bearer audioUrl, but the production app version and legacy records must be checked before rollout. Use explicit --project enso-prod-app only after approval.

## Rollback
Restore exact backed-up rules and indexes, then deploy only the affected resources to the explicitly approved project. Reverting to permissive rules can reopen cross-user exposure; treat as short incident mitigation and reapply hardening after fixing the incompatibility. Never roll back by granting blanket authenticated read/write.
