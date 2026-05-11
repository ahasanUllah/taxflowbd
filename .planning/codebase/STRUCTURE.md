# Codebase Structure

**Analysis Date:** 2026-05-11

## Directory Layout

```
taxflowbd/
├── src/
│   ├── app/                    # Next.js App Router pages and API routes
│   │   ├── (auth)/             # Route group — no URL segment; shared auth layout
│   │   │   ├── login/
│   │   │   │   └── page.tsx    # Login page ("use client")
│   │   │   └── register/
│   │   │       └── page.tsx    # Registration page ("use client")
│   │   ├── api/
│   │   │   └── auth/
│   │   │       └── [...all]/
│   │   │           └── route.ts  # Better Auth catch-all handler
│   │   ├── globals.css           # Global styles (Tailwind v4)
│   │   └── layout.tsx            # Root layout — font, lang="bn", SpeedInsights
│   ├── components/
│   │   └── shared/               # Reusable UI components across route groups
│   │       └── LogoutButton.tsx  # Client component — calls signOut()
│   ├── config/
│   │   └── tax-config.ts         # Single source of truth for all Bangladesh tax constants
│   ├── engines/                  # Pure computation — no DB, no HTTP
│   │   ├── tax-calculator.ts     # calculateTax() — full tax liability pipeline
│   │   └── rebate-optimizer.ts   # optimizeRebate() — investment gap analysis
│   ├── lib/                      # Server and client infrastructure utilities
│   │   ├── auth.ts               # Better Auth server config + databaseHooks (server-only)
│   │   ├── auth-client.ts        # Better Auth React client (client-only)
│   │   └── mongodb.ts            # Mongoose connection with hot-reload-safe global cache
│   ├── models/                   # Mongoose schema definitions
│   │   ├── User.ts               # UserProfile — tax-domain user data
│   │   └── TaxReturn.ts          # TaxReturn — annual return document
│   ├── types/
│   │   └── index.ts              # Shared TypeScript interfaces (engine I/O, API shapes)
│   └── proxy.ts                  # Next.js 16 edge route guard (NOT middleware.ts)
├── docs/                         # Project documentation
│   ├── project_spec.md
│   ├── architecture.md
│   ├── changelog.md
│   └── project_status.md
├── .planning/
│   └── codebase/                 # GSD codebase map documents
├── public/                       # Static assets
├── next.config.ts                # Next.js config (security headers)
├── tailwind.config.ts            # Tailwind v4 config
├── tsconfig.json                 # TypeScript strict mode
└── package.json
```

## Directory Purposes

**`src/app/(auth)/`:**
- Purpose: Unauthenticated pages — login and register
- Contains: "use client" page components with form state
- Key files: `src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`
- Note: Route group — `(auth)` does NOT appear in the URL

**`src/app/api/`:**
- Purpose: API route handlers — server-side only
- Contains: Route handlers; each must independently verify session
- Key files: `src/app/api/auth/[...all]/route.ts`
- Planned: `/api/profile`, `/api/tax/calculate`, `/api/interview`, `/api/returns`

**`src/components/shared/`:**
- Purpose: UI components used across multiple route groups
- Contains: Client components only
- Key files: `src/components/shared/LogoutButton.tsx`

**`src/config/`:**
- Purpose: Application constants — tax rules, feature flags
- Contains: `as const` config objects; never mutated at runtime
- Key files: `src/config/tax-config.ts`

**`src/engines/`:**
- Purpose: Pure business logic — tax calculation and optimization
- Contains: Stateless functions that take inputs and return outputs; no DB or HTTP calls
- Key files: `src/engines/tax-calculator.ts`, `src/engines/rebate-optimizer.ts`

**`src/lib/`:**
- Purpose: Infrastructure and service clients
- Contains: Auth config (server), auth client (client), DB connection
- Key files: `src/lib/auth.ts` (server-only), `src/lib/auth-client.ts` (client-only), `src/lib/mongodb.ts`

**`src/models/`:**
- Purpose: Mongoose schema definitions and model exports
- Contains: One file per collection; each uses hot-reload guard
- Key files: `src/models/User.ts` (collection: `userprofiles`), `src/models/TaxReturn.ts` (collection: `taxreturns`)

**`src/types/`:**
- Purpose: Shared TypeScript type definitions
- Contains: Engine I/O interfaces, API response shapes, domain enums
- Key files: `src/types/index.ts`

## Key File Locations

**Entry Points:**
- `src/proxy.ts`: Edge route guard — runs before every `/dashboard/*` request
- `src/app/layout.tsx`: Root layout — applies to all routes
- `src/app/api/auth/[...all]/route.ts`: Better Auth API bridge

**Configuration:**
- `src/config/tax-config.ts`: All Bangladesh tax constants (slabs, thresholds, rebate rates, minimum tax)
- `next.config.ts`: Security headers, Next.js options
- `tsconfig.json`: TypeScript strict mode, `@/` path alias pointing to `src/`

**Core Logic:**
- `src/engines/tax-calculator.ts`: `calculateTax(input: TaxCalculationInput): TaxCalculationResult`
- `src/engines/rebate-optimizer.ts`: `optimizeRebate(input, result): RebateOptimizationResult`
- `src/lib/auth.ts`: Session config, `databaseHooks` (UserProfile auto-creation)

**Data Models:**
- `src/models/User.ts`: `UserProfile` — betterAuthUserId, TIN, phone, taxpayerType, subscription, profileCompleteness
- `src/models/TaxReturn.ts`: `TaxReturn` — income, exemptions, investments, calculation, status

**Types:**
- `src/types/index.ts`: `TaxCalculationInput`, `TaxCalculationResult`, `RebateOptimizationResult`, `ApiSuccess<T>`, `ApiError`, `UserProfileData`, `TaxReturnData`

## Naming Conventions

**Files:**
- Page components: `page.tsx` (Next.js App Router convention)
- Layout components: `layout.tsx`
- Route handlers: `route.ts`
- Models: `PascalCase.ts` matching the Mongoose model name (e.g., `User.ts`, `TaxReturn.ts`)
- Engines: `kebab-case.ts` describing the operation (e.g., `tax-calculator.ts`)
- Lib utilities: `kebab-case.ts` (e.g., `auth-client.ts`, `mongodb.ts`)
- Config: `kebab-case.ts` with `-config` suffix (e.g., `tax-config.ts`)

**Directories:**
- Route groups: `(name)` — lowercase with parens, no URL segment
- Dynamic segments: `[param]` — lowercase
- Catch-all: `[...param]`
- Feature dirs: `kebab-case` (e.g., `shared`, `engines`)

**Exports:**
- Mongoose models: `export default ModelName` — named after the model
- Engine functions: named exports (`export function calculateTax(...)`)
- Config objects: named exports (`export const TAX_CONFIG`)
- Types: named exports from `src/types/index.ts`
- Auth instances: named exports (`export const auth`, `export const { signIn, signOut, ... }`)

**Components:**
- Always PascalCase filename matching the default export (e.g., `LogoutButton.tsx` exports `LogoutButton`)
- "use client" directive on first line when component uses hooks or browser APIs

## Where to Add New Code

**New dashboard page:**
- Implementation: `src/app/dashboard/[feature]/page.tsx`
- Must call `auth.api.getSession()` at top of server component; redirect to `/login` if null
- Client subcomponents: `src/components/[feature]/ComponentName.tsx`

**New API route:**
- Implementation: `src/app/api/[resource]/route.ts`
- Required pattern: verify session → validate Zod schema → call engine/model → return `ApiSuccess | ApiError`
- Rate limiting: apply `src/lib/rate-limit.ts` (10 req/min)

**New Mongoose model:**
- Implementation: `src/models/ModelName.ts`
- Required: hot-reload guard (`mongoose.models.ModelName ?? mongoose.model(...)`)
- Required: `async function()` for pre-save hooks (Mongoose 9 — no next() callback)

**New tax engine function:**
- Implementation: `src/engines/[feature].ts`
- Must: be pure (no DB, no HTTP), import constants only from `src/config/tax-config.ts`
- Must: have types defined in `src/types/index.ts`

**New shared type:**
- Location: `src/types/index.ts` (append to existing file)

**New tax constant:**
- Location: `src/config/tax-config.ts` only — never inline in engine or API code

**New shared component:**
- Location: `src/components/shared/ComponentName.tsx` for cross-route-group components
- Location: `src/components/[feature]/ComponentName.tsx` for feature-specific components

## Special Directories

**`.planning/codebase/`:**
- Purpose: GSD codebase map documents (ARCHITECTURE.md, STRUCTURE.md, etc.)
- Generated: Yes (by GSD mapper agent)
- Committed: Yes

**`docs/`:**
- Purpose: Project specification, architecture narrative, changelog, status tracking
- Generated: No — manually maintained
- Committed: Yes
- Update trigger: After every major milestone per CLAUDE.md section 9

**`public/`:**
- Purpose: Static assets served at root URL
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-05-11*
