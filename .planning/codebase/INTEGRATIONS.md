# External Integrations

**Analysis Date:** 2026-05-11

## APIs & External Services

**Tax Filing (Government):**
- NBR eTax Portal (etaxnbr.gov.bd) - Manual upload target for generated PDFs
  - No public API; NO programmatic submission
  - Flow: platform generates PDF → user uploads manually → user enters acknowledgment number back into platform
  - NEVER describe this as "auto-submit"

**Performance Monitoring:**
- Vercel Speed Insights - Page performance telemetry
  - SDK: `@vercel/speed-insights` ^2.0.0
  - No auth required; injected via Vercel platform

**Email (Planned — not yet installed):**
- Resend - Transactional email (registration confirmation, OTP, receipts)
  - SDK: `resend` (not yet in `package.json`)
  - Auth: env var (not yet defined)

**Payment (Planned — not yet installed):**
- SSLCommerz - Bangladesh payment gateway
  - SDK: SSLCommerz Node.js SDK (not yet in `package.json`)
  - Use case: subscription upgrades (FREE → SMART → PRO)
  - Auth: merchant credentials via env vars (not yet defined)
  - NEVER use Stripe or international payment gateways

## Data Storage

**Databases:**
- MongoDB Atlas - Primary data store
  - Connection env var: `MONGODB_URI`
  - Mongoose client (ODM): `src/lib/mongodb.ts` — cached singleton via `global.mongooseCache`
  - Native MongoClient: used directly by Better Auth adapter in `src/lib/auth.ts`
  - Database name: `taxflowbd`
  - Collections:
    - `userprofiles` — `src/models/User.ts` (IUserProfile schema)
    - `taxreturns` — `src/models/TaxReturn.ts` (ITaxReturn schema)
    - Better Auth internal collections (users, sessions, accounts) — managed by `mongodbAdapter`

**File Storage:**
- Local PDF generation only (`pdf-lib`)
- No cloud file storage configured (S3, GCS, etc. not present)

**Caching:**
- SWR (`swr` ^2.4.1) — client-side stale-while-revalidate for API responses
- No server-side cache layer (Redis not present)

## Authentication & Identity

**Auth Provider:**
- Better Auth v1.6.10 — self-hosted, no third-party identity provider
  - Strategy: email + password only (Phase 1); social login not configured
  - Server instance: `src/lib/auth.ts` (server-only import)
  - Client instance: `src/lib/auth-client.ts` (client-only import)
  - Route handler: `src/app/api/auth/[...all]/route.ts` via `toNextJsHandler`
  - Session duration: 30 days; refresh window: 1 day
  - Plugin: `nextCookies()` for server-side cookie access
  - Database hook: creates `UserProfile` document in MongoDB after user registration
  - Exports used on client: `signIn`, `signUp`, `signOut`, `useSession`

**Auth Guard:**
- `src/proxy.ts` — Next.js 16 proxy export (not middleware.ts)
- Reads session cookie via `getSessionCookie` from `better-auth/cookies`
- Protects: `/dashboard/:path*`
- Redirect target: `/login`
- Double-auth rule: proxy.ts gates routing; every API route independently verifies session

**Password Security:**
- `bcryptjs` ^3.0.3 — hashing (Better Auth uses this internally)
- Minimum password length: 8 characters (enforced in `src/lib/auth.ts`)

## Monitoring & Observability

**Performance:**
- Vercel Speed Insights — automatic via `@vercel/speed-insights`

**Error Tracking:**
- None configured (Sentry, Datadog, etc. not present)

**Logs:**
- `console.error` for server-side errors (e.g., UserProfile creation failure)
- Generic Bangla error messages surfaced to users; detailed errors in server console only

## CI/CD & Deployment

**Hosting:**
- Vercel (primary)
  - Production URL: `https://taxflowbd.vercel.app`
  - Speed Insights enabled

**CI Pipeline:**
- None configured (GitHub Actions, CircleCI, etc. not present)

## Environment Configuration

**Required env vars:**
- `MONGODB_URI` — MongoDB Atlas connection string
- `BETTER_AUTH_SECRET` — Better Auth signing secret
- `BETTER_AUTH_URL` — Full URL of auth server (dev: `http://localhost:3000`; prod: `https://taxflowbd.vercel.app`)
- `NEXT_PUBLIC_APP_URL` — Public base URL (used by auth-client.ts)
- `ENCRYPTION_KEY` — For TIN encryption before DB write

**Secrets location:**
- `.env.local` (local dev, gitignored)
- Vercel environment variables (production)
- NEVER prefix sensitive vars with `NEXT_PUBLIC_`

## Webhooks & Callbacks

**Incoming:**
- `/api/auth/[...all]` — Better Auth handles all auth callbacks (sign-in, sign-up, session refresh)

**Outgoing:**
- None currently configured

## AdSense Restriction

- Google AdSense: permitted ONLY on `/blog` and `/calculators` routes
- NEVER place AdSense inside `/dashboard` or any tax filing flow pages

---

*Integration audit: 2026-05-11*
