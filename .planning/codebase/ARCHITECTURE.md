<!-- refreshed: 2026-05-11 -->
# Architecture

**Analysis Date:** 2026-05-11

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                      Browser / Client                        │
│   "use client" pages  │  SWR hooks  │  Better Auth client   │
│   `src/app/(auth)/`   │             │  `src/lib/auth-client` │
└──────────┬────────────┴──────┬──────┴──────────┬────────────┘
           │                   │                  │
           ▼                   ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  Next.js App Router (SSR)                    │
│  proxy.ts (edge guard)  │  Server Components  │  API Routes  │
│  `src/proxy.ts`         │  `src/app/**/page`  │  `src/app/api` │
└──────────┬──────────────┴──────────┬───────────┴─────┬───────┘
           │                         │                   │
           ▼                         ▼                   ▼
┌──────────────────┐  ┌──────────────────────┐  ┌──────────────────┐
│  Better Auth     │  │  Tax Engines         │  │  MongoDB Atlas   │
│  `src/lib/auth`  │  │  `src/engines/`      │  │  via Mongoose 9  │
│  session mgmt    │  │  tax-calculator.ts   │  │  `src/lib/       │
│  + databaseHooks │  │  rebate-optimizer.ts │  │   mongodb.ts`    │
└──────────────────┘  └──────────────────────┘  └──────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| proxy.ts | Edge-level route guard — redirects unauthenticated users away from /dashboard | `src/proxy.ts` |
| auth.ts | Better Auth server config, session config, databaseHooks (UserProfile creation) | `src/lib/auth.ts` |
| auth-client.ts | Client-side Better Auth instance, exports signIn/signUp/signOut/useSession | `src/lib/auth-client.ts` |
| auth API route | Bridges Better Auth to Next.js — handles all /api/auth/* requests | `src/app/api/auth/[...all]/route.ts` |
| mongodb.ts | Mongoose connection with hot-reload-safe global cache | `src/lib/mongodb.ts` |
| tax-calculator.ts | Pure calculation engine — no side effects, no DB | `src/engines/tax-calculator.ts` |
| rebate-optimizer.ts | Computes additional investment needed for max rebate | `src/engines/rebate-optimizer.ts` |
| tax-config.ts | Single source of truth for all tax constants (slabs, thresholds, rates) | `src/config/tax-config.ts` |
| User.ts | Mongoose model for tax-domain user data, linked to Better Auth via betterAuthUserId | `src/models/User.ts` |
| TaxReturn.ts | Mongoose model for a single annual tax return — draft through submitted | `src/models/TaxReturn.ts` |

## Pattern Overview

**Overall:** Layered Next.js App Router with dual-auth guard, pure functional tax engine, and separated identity (Better Auth) from domain data (UserProfile).

**Key Characteristics:**
- Route protection is two-layer: proxy.ts at the edge + explicit session check inside every API route handler
- Identity is split: Better Auth owns email/password/session; UserProfile (MongoDB) owns TIN, taxpayer type, subscription, etc.
- Tax calculation is fully pure — `calculateTax()` takes an input object and returns a result object with no DB access
- All tax constants live in `src/config/tax-config.ts`; engines import from there only
- API responses always conform to `ApiSuccess<T> | ApiError` from `src/types/index.ts`

## Layers

**Edge Guard:**
- Purpose: Redirect unauthenticated requests before they reach page/API handlers
- Location: `src/proxy.ts`
- Contains: `proxy()` export (not middleware.ts — Next.js 16 convention)
- Depends on: `better-auth/cookies` (getSessionCookie — cookie check only, no DB)
- Used by: Next.js runtime via `config.matcher`

**Auth Layer:**
- Purpose: Session creation, validation, and UserProfile bootstrapping
- Location: `src/lib/auth.ts` (server), `src/lib/auth-client.ts` (client)
- Contains: betterAuth config, mongodbAdapter, nextCookies plugin, databaseHooks
- Depends on: MongoDB native client (separate from Mongoose connection), `src/models/User.ts`
- Used by: `src/app/api/auth/[...all]/route.ts`, server components, API route handlers

**Presentation Layer:**
- Purpose: UI pages and client-side interaction
- Location: `src/app/(auth)/`, `src/app/dashboard/` (planned)
- Contains: "use client" page components, form state, useSession hook calls
- Depends on: `src/lib/auth-client.ts`, SWR (planned)
- Used by: Browser

**API Layer:**
- Purpose: Validated, authenticated server actions
- Location: `src/app/api/`
- Contains: Route handlers with independent session verification + Zod validation
- Depends on: `src/lib/auth.ts`, `src/engines/`, `src/models/`
- Used by: Client components via fetch/SWR

**Engine Layer:**
- Purpose: Pure tax computation — stateless, testable, no I/O
- Location: `src/engines/`
- Contains: `calculateTax()`, `optimizeRebate()`
- Depends on: `src/config/tax-config.ts`, `src/types/index.ts`
- Used by: API routes (planned: `/api/tax/calculate`)

**Data Layer:**
- Purpose: MongoDB schema definitions and query interface
- Location: `src/models/`
- Contains: Mongoose models with hot-reload guard (`mongoose.models.X ?? mongoose.model(...)`)
- Depends on: `src/lib/mongodb.ts`
- Used by: API route handlers, `src/lib/auth.ts` databaseHooks

## Data Flow

### Authentication — Registration

1. User submits form (`src/app/(auth)/register/page.tsx`) — calls `signUp.email()` from `src/lib/auth-client.ts`
2. Better Auth handles POST to `/api/auth/sign-up/email` → `src/app/api/auth/[...all]/route.ts`
3. Better Auth writes user to its own MongoDB collection via `mongodbAdapter`
4. `databaseHooks.user.create.after` fires in `src/lib/auth.ts` — creates `UserProfile` via `src/models/User.ts`
5. Session cookie set by `nextCookies()` plugin; client redirects to `/dashboard`

### Authentication — Login

1. User submits form (`src/app/(auth)/login/page.tsx`) — calls `signIn.email()` from `src/lib/auth-client.ts`
2. Better Auth verifies credentials, issues 30-day session cookie
3. Client redirects to `/dashboard`; proxy.ts validates cookie on subsequent requests

### Authentication — Logout

1. `LogoutButton` (`src/components/shared/LogoutButton.tsx`) calls `signOut()` from `src/lib/auth-client.ts`
2. Better Auth invalidates server session; client redirects to `/login`

### Route Protection

1. Request arrives for `/dashboard/*`
2. `proxy.ts` runs `getSessionCookie(request)` — cookie-only check (no DB round-trip)
3. No cookie → redirect to `/login`; cookie present → `NextResponse.next()`
4. API route handler independently calls `auth.api.getSession({ headers })` to cryptographically verify session

### Tax Calculation Pipeline (planned — engines ready, API routes pending)

1. User completes interview at `/return/interview` → POST to `/api/interview`
2. `/api/tax/calculate` receives `TaxCalculationInput` (validated by Zod)
3. `calculateTax(input)` in `src/engines/tax-calculator.ts`:
   - Sums all income sources → `grossIncome`
   - Computes `consolidatedAllowance = MIN(gross/3, ৳4,50,000)` via `TAX_CONFIG`
   - Applies tax-free threshold per `input.category` (general / womenAndSenior / disabledAndThirdGender)
   - Runs progressive slab tax from `TAX_CONFIG.slabs`
   - Computes investment rebate: `MIN(actual, 30% of taxable, ৳1.5cr) × 15%`
   - Applies minimum tax floor per `input.residence`
   - Returns `TaxCalculationResult`
4. `optimizeRebate(input, result)` in `src/engines/rebate-optimizer.ts` computes additional investment needed
5. Result saved to `TaxReturn` document (`src/models/TaxReturn.ts`) with `status: DRAFT`
6. User reviews at `/return/review` (legal disclaimer mandatory)
7. User triggers PDF generation (pdf-lib) — downloads file
8. User uploads PDF to `etaxnbr.gov.bd` manually (NBR constraint — no API)
9. User enters acknowledgment number → API sets `TaxReturn.status = SUBMITTED`

**State Management:**
- Server state: MongoDB via Mongoose (UserProfile, TaxReturn)
- Session state: Better Auth cookie (30-day expiry, refreshed every 24h)
- Client UI state: React local state in "use client" components; SWR for server data (planned)

## Key Abstractions

**TaxCalculationInput / TaxCalculationResult:**
- Purpose: Contract between API layer and engine layer
- Examples: `src/types/index.ts` (definitions), `src/engines/tax-calculator.ts` (consumer)
- Pattern: Pure data transfer objects — no methods

**TAX_CONFIG:**
- Purpose: Single source of truth for all Bangladesh tax parameters (AY 2025-26)
- Examples: `src/config/tax-config.ts`
- Pattern: `as const` object — import only, never mutate, never inline values elsewhere

**ApiSuccess<T> | ApiError:**
- Purpose: Uniform API response envelope
- Examples: `src/types/index.ts`
- Pattern: All API route handlers must return one of these two shapes

**UserProfile dual-identity:**
- Purpose: Separates auth identity (Better Auth) from tax-domain data (Mongoose)
- Examples: `src/lib/auth.ts` (hook), `src/models/User.ts` (schema)
- Pattern: `betterAuthUserId` string FK links the two records; never store tax data in Better Auth user table

## Entry Points

**Proxy (edge guard):**
- Location: `src/proxy.ts`
- Triggers: All requests matching `/dashboard/:path*`
- Responsibilities: Cookie presence check only; redirect or pass through

**Auth API catch-all:**
- Location: `src/app/api/auth/[...all]/route.ts`
- Triggers: All `/api/auth/*` requests (sign-in, sign-up, sign-out, session)
- Responsibilities: Delegates entirely to Better Auth via `toNextJsHandler(auth)`

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Hind Siliguri font (Bengali), html `lang="bn"`, Vercel SpeedInsights

## Architectural Constraints

- **Threading:** Single-threaded Node.js event loop; Mongoose connection cached in `global.mongooseCache` to survive Next.js hot-reload
- **Global state:** `global.mongooseCache` in `src/lib/mongodb.ts`; Mongoose model registry uses `mongoose.models.X ?? mongoose.model(...)` guard in all models
- **Next.js 16:** Uses `proxy.ts` + `export function proxy()` — NOT `middleware.ts`. This is a breaking change from Next.js 15
- **Mongoose 9:** `pre("save")` hooks use `async function()` — no `next()` callback (breaking change from Mongoose 8)
- **Two MongoDB clients:** Better Auth uses native `MongoClient` on `taxflowbd` DB; Mongoose uses its own connection via `MONGODB_URI`. Both target the same Atlas cluster but are separate connections
- **NBR constraint:** Platform never auto-submits to NBR. PDF generation is the terminal step; acknowledgment number entry is the only post-submission action

## Anti-Patterns

### Hardcoding tax values outside tax-config.ts

**What happens:** Writing slab rates, thresholds, or rebate percentages directly in component or API files
**Why it's wrong:** Tax rules change yearly; scattered values cause silent calculation errors across AY boundaries
**Do this instead:** All numeric tax constants must come from `src/config/tax-config.ts`. Engines read from `TAX_CONFIG` only.

### Trusting proxy.ts alone for API security

**What happens:** Skipping the `auth.api.getSession()` check inside an API route handler because proxy.ts already ran
**Why it's wrong:** API routes can be called directly (bypassing the proxy matcher); proxy only checks cookie presence not validity
**Do this instead:** Every API route handler independently calls `auth.api.getSession({ headers: await headers() })` and returns 401 if null

### Importing auth.ts in client components

**What happens:** Importing from `src/lib/auth.ts` in a "use client" file
**Why it's wrong:** auth.ts is server-only (MongoClient, secrets); causes build failure or secret leakage
**Do this instead:** Client components import only from `src/lib/auth-client.ts`

## Error Handling

**Strategy:** Bangla error messages surfaced to users; detailed errors to server console only

**Patterns:**
- API routes: `try/catch` → return `{ success: false, error: "বাংলা বার্তা" }` + appropriate HTTP status
- `databaseHooks`: errors caught and logged to `console.error`; auth flow is not blocked (UserProfile creation failure is non-fatal)
- Client forms: error state displayed inline in Bangla; loading state shown with "লোড হচ্ছে..."

## Cross-Cutting Concerns

**Logging:** `console.error` for server-side failures; no structured logging library yet
**Validation:** Zod on all API inputs (planned for all routes)
**Authentication:** Double-layer — proxy.ts cookie check + per-route `auth.api.getSession()` verification
**Font:** Hind Siliguri (Bengali subset) loaded globally in `src/app/layout.tsx`; `--font-bangla` CSS variable
**Monitoring:** Vercel SpeedInsights injected in root layout

---

*Architecture analysis: 2026-05-11*
