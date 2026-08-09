# Enso Web Portal

## Tech Stack
- Next.js 16.3.0 (App Router, static export)
- React 19
- Tailwind CSS v4
- Firebase (Auth, Firestore, Storage, Functions)
- Firebase Admin SDK (server-side)
- Framer Motion

## Project Structure
```
src/
  app/           # Pages and API routes
    (portal)/    # Authenticated user portal
    api/         # API routes
    login/       # Auth pages
    blog/        # Public pages
  components/    # React components
    auth/        # Auth components
    layout/      # Navbar, Footer, ClientLayout
    portal/      # PortalLayout, StatCard, SubscriptionBadge
    ui/          # AnimatedOwl, EnsoCircle, QrCode, etc.
    theme/       # ThemeProvider
    home/        # Landing page sections
  lib/           # Utilities and config
    firebase.ts  # Client Firebase init
    firebaseAdmin.ts # Admin SDK init
    auth.ts      # Auth functions
    firestore.ts # Firestore access
    types.ts     # TypeScript types
    theme.ts     # Theme definition
    themes.ts    # Theme variants
```

## Key Patterns
- `'use client'` for all interactive components
- Session cookies for server-side auth
- Admin claims via `admin: true` custom claim
- Static export with Firebase Hosting rewrites for API routes
