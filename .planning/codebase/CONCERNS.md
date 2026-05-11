# Codebase Concerns

**Analysis Date:** 2026-05-11

---

## Security Gaps

### Rate Limiting Completely Absent

- Risk: No rate limiting exists anywhere in the codebase. `src/lib/rate-limit.ts` does not exist.
- Files: `src/proxy.ts`, `src/app/api/auth/[...all]/route.ts`
- Impact: Login endpoint is fully open to brute-force attacks. Registration can be spammed to exhaust MongoDB Atlas free-tier write quota. CLAUDE.md mandates "Rate limit 10 req/min on all routes" — this requirement is entirely unimplemented.
- Fix approach: Create `src/lib/rate-limit.ts` using an in-memory sliding-window map (or `lru-cache` package). Apply to all API route handlers before auth checks. Apply separately on the auth proxy route.

### TIN Stored Plaintext — Encryption Requirement Violated

- Risk: `ENCRYPTION_KEY` env var is listed in CLAUDE.md as required but is referenced nowhere in the codebase. `src/models/User.ts` stores TIN as a raw string in MongoDB with no encryption.
- Files: `src/models/User.ts` (line 28–34), `src/lib/auth.ts`
- Impact: A MongoDB Atlas credential leak exposes every taxpayer's 12-digit TIN in plaintext. TIN is a government-issued identity number; its exposure is a regulatory and reputational risk.
- Fix approach: Create `src/lib/encryption.ts` with AES-256-GCM encrypt/decrypt using `ENCRYPTION_KEY`. Add Mongoose virtual or pre-save/post-init hooks in `User.ts` to encrypt on write and decrypt on read. Never return raw TIN from API routes.

### No Security Headers in next.config.ts

- Risk: `next.config.ts` contains only a `turbopack.root` setting. No `headers()` export exists. Missing: `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy`, `Referrer-Policy`.
- Files: `next.config.ts`
- Impact: Clickjacking, MIME sniffing, and XSS via injected scripts are unmitigated. Required for any financial/tax application.
- Fix approach: Add async `headers()` export to `next.config.ts` applying security headers to `/(.*)`path matcher.

### proxy.ts Protects Only /dashboard — API Routes Unprotected

- Risk: `src/proxy.ts` only checks `pathname.startsWith("/dashboard")` and redirects unauthenticated users to `/login`. It does not protect API routes.
- Files: `src/proxy.ts` (lines 7–13)
- Impact: All future API routes under `/api/` (profile, tax/calculate, tax/optimize, interview) will be reachable without a session unless each handler independently verifies auth. CLAUDE.md requires "double auth: proxy.ts + every API route independently." The proxy side of this contract is only half-implemented (dashboard pages only; API routes depend entirely on per-route checks with no proxy-level failsafe).
- Fix approach: Extend the matcher in `proxy.ts` to include `/api/profile/:path*`, `/api/tax/:path*`, `/api/interview/:path*`. Return a 401 JSON response (not a redirect) for unauthenticated API calls. Per-route checks must still exist independently.

### UserProfile Creation Failure Is Silently Swallowed

- Risk: In `src/lib/auth.ts` the `databaseHooks.user.create.after` handler catches all errors and only logs them. If `UserProfile.create()` fails (e.g., MongoDB connection issue), the Better Auth user record exists but no `UserProfile` document is created.
- Files: `src/lib/auth.ts` (lines 27–34)
- Impact: Downstream routes that query `UserProfile` by `betterAuthUserId` will find no document and either throw or return empty data. There is no reconciliation mechanism. The user account appears valid but is broken.
- Fix approach: Add a repair query on every profile API handler (`UserProfile.findOneAndUpdate({ betterAuthUserId }, {}, { upsert: true, setDefaultsOnInsert: true })`). Alternatively, surface the creation failure to Better Auth so the registration transaction rolls back (requires Better Auth error propagation support).

---

## Tech Debt

### TaxReturn Schema Diverges from Engine Types

- Issue: `src/models/TaxReturn.ts` stores income as `{ basicSalary, houseRent, medical, conveyance, bonus, otherAllowances, freelanceIncome, businessIncome, otherIncome }`. The tax engine in `src/engines/tax-calculator.ts` operates on `{ salary, businessOrProfession, houseProperty, agriculturalIncome, capitalGains, otherSources }` (defined in `src/types/index.ts`).
- Files: `src/models/TaxReturn.ts` (lines 7–17), `src/types/index.ts` (lines 14–21), `src/engines/tax-calculator.ts`
- Impact: There is no mapping layer between these two shapes. Any Phase 5 API route that reads a saved `TaxReturn` and passes it to `calculateTax()` will need an ad-hoc transformation or will pass incorrectly shaped data. `TaxReturnData` interface in `src/types/index.ts` (lines 90–100) references `input: TaxCalculationInput` and `result: TaxCalculationResult` — neither of which matches the Mongoose schema fields.
- Fix approach: Before Phase 5, decide canonical income shape. Either update `TaxReturn.ts` to match `TaxCalculationInput` exactly, or create an explicit mapper function `toCalculationInput(taxReturn: ITaxReturn): TaxCalculationInput` and document the split intentionally.

### Two Parallel MongoDB Clients Running Simultaneously

- Issue: `src/lib/auth.ts` instantiates a `new MongoClient(...)` (native driver) at module load time. `src/lib/mongodb.ts` manages a separate Mongoose connection. Both connect to the same `taxflowbd` database on Atlas.
- Files: `src/lib/auth.ts` (line 11), `src/lib/mongodb.ts`
- Impact: Two connection pools to Atlas from the same serverless function instance. On Vercel serverless, each cold start creates both. Atlas free tier (M0) has a 500 connection limit; this doubles connection consumption per instance. There is no shared connection strategy.
- Fix approach: Pass the native MongoClient from `src/lib/mongodb.ts` (expose the underlying client) to `mongodbAdapter()` in `auth.ts`, eliminating the second client. Requires refactoring `mongodb.ts` to export the `MongoClient` instance alongside the Mongoose connection.

### Zod Not Installed — Validation Requirement Unmet

- Issue: `zod` does not appear in `package.json` dependencies or devDependencies. CLAUDE.md mandates "Zod validation on ALL API inputs."
- Files: `package.json`
- Impact: No API routes built in Phases 4-8 can fulfill the Zod validation requirement without first installing the package. This is a missing dependency, not a missing implementation.
- Fix approach: `npm install zod`. Create `src/lib/validators/` directory with per-feature schema files before Phase 5.

### Resend and SSLCommerz Not Installed

- Issue: `resend` and any SSLCommerz SDK are absent from `package.json`. Both are listed as mandatory stack components in CLAUDE.md.
- Files: `package.json`
- Impact: Email features (registration confirmation, filing reminders) and payment (subscription) cannot be built without these packages. Installing later may require API integration re-work if assumed at architecture time.
- Fix approach: Install `resend` before Phase 4 (profile) if email verification is needed. Install SSLCommerz SDK before Phase 7.

### SWR Not Used Yet — No Data Fetching Patterns Established

- Issue: `swr` is installed (`^2.4.1`) but unused. No SWR hooks exist in the codebase. No global SWR config (cache provider, error boundaries, revalidation settings) has been established.
- Files: `package.json`
- Impact: Phases 3-7 will implement SWR independently without shared patterns, risking inconsistent loading states, revalidation behavior, and error handling.
- Fix approach: Before Phase 3, create `src/lib/swr-config.tsx` with a global `SWRConfig` provider wrapping the dashboard layout. Define standard `fetcher` function and error shape.

---

## Missing Critical Features

### No Password Reset Flow

- Problem: Better Auth is configured with email/password only. There is no forgot-password or reset-password route, page, or email trigger.
- Blocks: Users who forget passwords have no recovery path. Required before any public launch.

### No Email Verification

- Problem: Registration completes immediately on form submit with no email verification step. Better Auth supports email verification but it is not configured in `src/lib/auth.ts`.
- Blocks: Fake account creation at scale. Required for any production deployment.

### Legal Disclaimer Not Implemented

- Problem: CLAUDE.md mandates "Legal disclaimer mandatory on every tax result page." No disclaimer component exists.
- Files: No file — component not created yet.
- Blocks: Compliance requirement. Must be implemented before Phase 5 (Tax Engine API) ships any calculation results.

### AdSense Guard Not Implemented

- Problem: CLAUDE.md mandates "AdSense ONLY on /blog and /calculators — NEVER inside dashboard or filing." No guard mechanism (layout-level check, route group separation) has been implemented to enforce this.
- Blocks: Risk of accidentally including ad scripts in dashboard components during Phase 3+ if not enforced structurally.

---

## Test Coverage Gaps

### Zero Tests Exist

- What is not tested: Every module — tax-calculator.ts, rebate-optimizer.ts, all models, all future API routes.
- Files: Entire `src/` tree
- Risk: Tax calculation errors (wrong slab boundaries, incorrect rebate caps, wrong minimum tax selection by district) will reach production undetected. These are financial figures presented to users as authoritative.
- Priority: High — `src/engines/tax-calculator.ts` and `src/engines/rebate-optimizer.ts` are pure functions with no side effects and are trivial to unit test. No test framework (Jest, Vitest) is installed.
- Fix approach: Install Vitest (`npm install -D vitest`). Create `src/engines/__tests__/tax-calculator.test.ts` with boundary cases: zero income, exactly at threshold, each slab boundary, women/senior threshold, minimum tax for each district category, maximum rebate cap at ৳1.5cr.

---

## Fragile Areas

### proxy.ts Cookie Check Has No Fallback Verification

- Files: `src/proxy.ts`
- Why fragile: `getSessionCookie(request)` checks for cookie presence only. It does not verify the session token against the database. A request with an expired or forged cookie value will pass the proxy check and reach the page. The actual session validation happens only when the page/API calls Better Auth.
- Safe modification: Always add independent `auth.api.getSession()` checks inside dashboard page server components and API route handlers. Never rely on the proxy cookie check as the sole auth gate.

### connectToDatabase Error Not Handled in Auth Hook

- Files: `src/lib/auth.ts` (line 29)
- Why fragile: If `connectToDatabase()` throws (e.g., Atlas unreachable), the error is caught and logged, but the `cached.promise` in `mongodb.ts` remains set to the rejected promise. Subsequent calls to `connectToDatabase()` will immediately re-throw the same rejected promise without retrying the connection.
- Safe modification: In `src/lib/mongodb.ts`, clear `cached.promise = null` in a `.catch()` handler so failed connections allow retry on the next request.

---

## Scaling Limits

### MongoDB Atlas Free Tier (M0)

- Current capacity: 512 MB storage, 500 connections, shared cluster
- Limit: Free tier is unsuitable for production traffic. With two MongoClient instances per cold start (see tech debt above), connection exhaustion will occur earlier than expected.
- Scaling path: Upgrade to M10 ($57/mo) before any public launch. Resolve dual-client issue first.

---

*Concerns audit: 2026-05-11*
