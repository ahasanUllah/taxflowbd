# Testing Patterns

**Analysis Date:** 2026-05-11

## Test Framework

**Runner:** None installed.

No test runner, assertion library, or test configuration file is present in the project.

**package.json scripts** (`C:\Projects\taxflowbd\package.json`):
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint"
}
```

No `test`, `test:watch`, or `test:coverage` script exists.

**devDependencies** — no test packages:
```json
{
  "@tailwindcss/postcss": "^4",
  "@types/bcryptjs": "^2.4.6",
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "16.2.6",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

No Jest, Vitest, Playwright, Cypress, Testing Library, or any other test framework is installed.

---

## Test File Organization

**Test files:** None. No `.test.ts`, `.test.tsx`, `.spec.ts`, or `.spec.tsx` files exist anywhere in the project.

**Test directories:** No `__tests__/` or `tests/` directories exist.

---

## Current Static Analysis

**TypeScript:** Strict mode — provides compile-time type safety as the only automated quality gate.

**ESLint:** `eslint-config-next` is configured. Run with:
```bash
npm run lint
```

These are the only two automated checks in the project.

---

## Coverage

**Requirements:** None enforced (no test runner present).

**Current coverage:** 0% — no tests exist.

---

## Test Coverage Gaps

**Tax calculation engine (`src/engines/tax-calculator.ts`):**
- What's not tested: all calculation paths — slab progression, consolidated allowance cap, investment rebate cap (min of 3 values), minimum tax floor, zero-income edge case, effectiveRate division-by-zero guard
- Risk: silent regression if tax rules change (e.g., new assessment year config in `src/config/tax-config.ts`) — bugs would reach production undetected
- Priority: High — this is the core financial logic; incorrect output has legal/financial consequences for users

**Rebate optimizer (`src/engines/rebate-optimizer.ts`):**
- What's not tested: already-maximized case (additionalInvestmentNeeded === 0), partial investment scenarios, Bangla number formatting via `toLocaleString("bn-BD")`
- Risk: incorrect optimizer recommendations shown to users
- Priority: High

**Mongoose models (`src/models/User.ts`, `src/models/TaxReturn.ts`):**
- What's not tested: pre-save hook score calculation in `User.ts`, TIN regex validator, compound unique index on `(userId, assessmentYear)` in `TaxReturn.ts`
- Risk: schema validation logic silently broken
- Priority: Medium

**Auth flows (`src/app/(auth)/login/page.tsx`, `src/app/(auth)/register/page.tsx`):**
- What's not tested: redirect on existing session, error state display, form validation (password mismatch), loading state transitions
- Risk: regression in auth UX
- Priority: Medium

**API routes:** Only one API route exists (`src/app/api/auth/[...all]/route.ts`) and it delegates entirely to `better-auth`. No custom API routes yet to test.

**`src/lib/mongodb.ts`:**
- What's not tested: connection caching logic, hot-reload cache reuse
- Priority: Low

---

## Recommended Test Setup (when adding tests)

**Recommended runner:** Vitest — compatible with Next.js App Router and TypeScript without additional transform config. Install:
```bash
npm install -D vitest @vitest/coverage-v8
```

**Recommended for component tests:** `@testing-library/react` + `jsdom`.

**Highest-priority first tests to write:**

1. Unit tests for `src/engines/tax-calculator.ts` — pure functions, no mocking required:
```typescript
import { calculateTax } from "@/engines/tax-calculator"

describe("calculateTax", () => {
  it("returns zero tax for income below free threshold", () => {
    const result = calculateTax({
      category: "general",
      residence: "dhakaChattogram",
      income: { salary: 300000, businessOrProfession: 0, houseProperty: 0, agriculturalIncome: 0, capitalGains: 0, otherSources: 0 },
      investments: { lifeInsurancePremium: 0, providentFund: 0, depositPensionScheme: 0, savingsCertificates: 0, stockMarket: 0, otherQualifyingInvestments: 0 },
    })
    expect(result.finalTaxLiability).toBe(0)
  })
})
```

2. Unit tests for `src/engines/rebate-optimizer.ts`.

3. Unit tests for `src/config/tax-config.ts` — verify slab rates sum correctly, thresholds match NBR rules.

**Test file placement:** Co-locate with source files using `.test.ts` suffix, or place in a top-level `src/__tests__/` directory — neither convention exists yet, so establish one when adding the first test.

---

*Testing analysis: 2026-05-11*
