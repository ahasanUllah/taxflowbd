# Coding Conventions

**Analysis Date:** 2026-05-11

## Bangla Language Rule (Zero Exceptions)

ALL user-facing text must be in Bangla. English is permitted only for: variable names, `console.log`, URLs, package names.

**Required Bangla strings by context:**

| Context | Bangla text |
|---------|-------------|
| Loading state | `লোড হচ্ছে...` |
| Saving state | `সংরক্ষণ হচ্ছে...` |
| Success state | `সফল হয়েছে ✅` |
| Login button | `লগইন করুন` |
| Register button | `নিবন্ধন করুন` |
| Save button | `সংরক্ষণ করুন` |
| Next button | `পরবর্তী` |
| Submit button | `দাখিল করুন` |
| Download button | `ডাউনলোড করুন` |
| Logout button | `লগআউট করুন` |

**Error messages:** Generic Bangla errors shown to users. Detailed errors go to `console.error` only. Example from `src/app/(auth)/register/page.tsx`:
```typescript
setError("নিবন্ধন ব্যর্থ হয়েছে। আবার চেষ্টা করুন.")  // user-facing
console.error("UserProfile creation failed for user:", user.id, err)  // server-only
```

**Engine recommendations** in Bangla: See `src/engines/rebate-optimizer.ts` — `recommendation` string field always in Bangla.

**Mongoose validation messages** in Bangla: See `src/models/User.ts`:
```typescript
message: "TIN অবশ্যই ১২ সংখ্যার হতে হবে"
```

**Mongoose comments** in Bangla: Inline schema comments use Bangla (see `src/models/User.ts`, `src/models/TaxReturn.ts`).

---

## Naming Patterns

**Files:**
- Page components: `page.tsx` (Next.js App Router convention)
- Shared components: PascalCase — `LogoutButton.tsx`
- Models: PascalCase noun — `User.ts`, `TaxReturn.ts`
- Engines (pure logic): kebab-case — `tax-calculator.ts`, `rebate-optimizer.ts`
- Config: kebab-case — `tax-config.ts`
- Lib utilities: camelCase — `mongodb.ts`, `auth-client.ts`

**Functions:**
- Handler functions: camelCase verb phrases — `handleSubmit`, `handleSignOut`
- Pure engine functions: camelCase verbs — `calculateTax`, `optimizeRebate`, `computeGrossTax`, `sumIncome`
- Exported page components: PascalCase default export — `RegisterPage`, `LoginPage`

**Variables:**
- camelCase throughout — `taxableIncome`, `grossIncome`, `investmentRebate`
- Boolean states: bare descriptive names — `loading`, `isPending`
- Error states: `error` (string), `signUpError` / `signInError` (destructured)

**Types and Interfaces:**
- Interfaces: PascalCase with `I` prefix for Mongoose Documents — `IUserProfile`, `ITaxReturn`
- Plain interfaces: PascalCase without prefix — `TaxCalculationInput`, `TaxCalculationResult`, `AuthUser`
- Type aliases: PascalCase — `TaxpayerCategory`, `TaxpayerResidence`, `ApiResponse`
- Enums (string literals): SCREAMING_SNAKE_CASE in string unions — `"DRAFT" | "COMPLETE" | "SUBMITTED"`, `"FREE" | "SMART" | "PRO"`

---

## API Response Format

All API routes must return one of two shapes (typed in `src/types/index.ts`):

**Success:**
```typescript
{ success: true, data: T, message: string }
```

**Error:**
```typescript
{ success: false, error: string }
```

The `ApiResponse<T>` union type is defined at `src/types/index.ts:114`.

---

## Security Rules

**Double auth:** Every API route must verify session independently. Do not rely on `proxy.ts` alone.

**Zod validation:** Required on all API route inputs before any processing.

**Rate limiting:** 10 requests/minute on all routes.

**Password field:** Never returned from DB. Use `select: false` in Mongoose models.

**TIN encryption:** TIN must be encrypted before writing to DB.

**No `NEXT_PUBLIC_` prefix** for sensitive data.

**Sensitive env vars** (server-only): `MONGODB_URI`, `BETTER_AUTH_SECRET`, `ENCRYPTION_KEY`.

---

## Tax Values — Config-Only Rule

Tax figures (slabs, thresholds, rebate rates, minimum tax) live exclusively in `src/config/tax-config.ts`. Never hardcode numeric tax values elsewhere. Engines import from `TAX_CONFIG`:

```typescript
import { TAX_CONFIG } from "@/config/tax-config"
```

`tax-config.ts` exports `TAX_CONFIG as const` with a `version` field (`"AY2025-26-v1"`) so calculation results can reference the config version that produced them (see `src/models/TaxReturn.ts:90` — `taxConfigVersion` field).

---

## Component Patterns

**Client components** declare `"use client"` on line 1. Used for all interactive pages (forms, auth pages, logout button).

**Server/auth separation:**
- `src/lib/auth.ts` — server-only. Comment says "never import in client components".
- `src/lib/auth-client.ts` — client-only. Comment says "only import in 'use client' components".

**Form state pattern** (from `src/app/(auth)/register/page.tsx`):
```typescript
const [form, setForm] = useState({ field1: "", field2: "" })
// update: functional updater to avoid stale state
onChange={e => setForm(f => ({ ...f, field: e.target.value }))}
```

**Loading/skeleton pattern** — check `isPending` from `useSession()` and render a full `animate-pulse` skeleton at the same dimensions as the real page. Applied in both `src/app/(auth)/login/page.tsx` and `src/app/(auth)/register/page.tsx`.

**Redirect on session** — `useEffect` guards pages that should not be accessed while logged in:
```typescript
useEffect(() => {
  if (session) router.replace("/dashboard")
}, [session, router])
```

**Shared components** accept optional `className` prop for style composition (see `src/components/shared/LogoutButton.tsx`).

**Default exports** for all page and component files.

---

## Mongoose Model Pattern

Defined in `src/models/User.ts` and `src/models/TaxReturn.ts`.

**Hot-reload guard** (required in every model file):
```typescript
const ModelName: Model<IModelName> =
  mongoose.models.ModelName ??
  mongoose.model<IModelName>("ModelName", ModelNameSchema)
export default ModelName
```

**Async pre-save hooks** (Mongoose 9 — no `next()` callback):
```typescript
UserProfileSchema.pre("save", async function () {
  // no next() — Mongoose 9 style
})
```

**Sub-schemas without `_id`**:
```typescript
const SubSchema = new Schema({ ... }, { _id: false })
```

**Collection names:** Explicit lowercase plural — `collection: "userprofiles"`, `collection: "taxreturns"`.

**Timestamps:** Always enabled — `{ timestamps: true }`.

---

## Import Organization

1. React/Next.js imports (`react`, `next/navigation`, `next/link`)
2. Internal lib imports (`@/lib/auth-client`, `@/lib/mongodb`)
3. Internal model imports (`@/models/User`)
4. Internal type imports (`@/types`)
5. Internal config imports (`@/config/tax-config`)

Path aliases: `@/` maps to `src/`.

---

## Code Style

**Formatting:** ESLint via `eslint-config-next`. No Prettier config detected.

**TypeScript:** Strict mode enabled (CLAUDE.md: "TS strict").

**No `next()` in Mongoose hooks:** Mongoose 9 async pre-hooks do not accept a `next` callback.

**`as const` on config objects:** `TAX_CONFIG` uses `as const` to enforce readonly literal types at `src/config/tax-config.ts`.

**Nullish coalescing preferred** over `||` for defaults: `mongoose.models.ModelName ?? mongoose.model(...)`.

**No inline ternary nesting** — loading states use simple ternary in JSX: `{loading ? "লোড হচ্ছে..." : "লগইন করুন"}`.

---

## Tailwind CSS v4 Patterns

**Mobile-first** layout. All pages start with `min-h-screen flex items-center justify-center`.

**Brand tokens** (custom CSS vars):
- `bg-brand-surface` — page background
- `text-brand-primary` — primary brand color
- `text-brand-accent` — accent/error color
- `bg-brand-primary` — primary button background

**Input field class pattern:**
```
w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm
focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary transition
```

**Button class pattern:**
```
w-full py-3 rounded-xl bg-brand-primary text-white font-semibold text-sm
hover:bg-brand-primary/90 disabled:opacity-60 transition
```

**Error display pattern:**
```
text-sm text-brand-accent bg-red-50 px-4 py-2.5 rounded-xl
```

**Skeleton animation:** `animate-pulse` with `bg-gray-200 rounded-xl` placeholder divs matching real element heights.

---

## Legal / Display Requirements

- Legal disclaimer is mandatory on every tax result page.
- AdSense only on `/blog` and `/calculators` routes — never inside dashboard or filing flows.
- NBR constraint: never claim auto-submit. Flow is: generate PDF → user uploads to etaxnbr.gov.bd → user enters acknowledgment number back into the platform.

---

*Convention analysis: 2026-05-11*
