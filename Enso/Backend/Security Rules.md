# Security Rules

## User Data
- Owner-only read/write
- No admin access to user journals
- Journey data: read-only for owner

## Partner Data
- Owner + admin read access
- All writes via Cloud Functions only
- Referral data: admin-only

## Admin
- Custom claim: admin: true
- Set via Admin SDK / gcloud
- No client path to set admin
