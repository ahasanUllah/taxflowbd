# TaxFlowBD — Complete Project Memory for Claude Code
# Read this file at the start of EVERY conversation.
# Working directory: C:\Projects\taxflowbd\
# NEVER work in worktree path.

---

## 1. PROJECT OVERVIEW

Platform: TaxFlowBD
Domain: taxflowbd.com
Type: AI-driven digital income tax filing platform
Country: Bangladesh
Legal basis: আয়কর আইন ২০২৩ (Income Tax Act 2023) by NBR
Founder: Solo founder, building alone

Mission: বাংলাদেশের করদাতাদের জন্য AI-চালিত ট্যাক্স রিটার্ন
ফাইলিং প্ল্যাটফর্ম। ৯০% প্রক্রিয়া স্বয়ংক্রিয়।

Target Users:
- PRIMARY: বেতনভুক্ত চাকুরিজীবী (salaried employees)
- SECONDARY: IT পেশাদার ও ফ্রিল্যান্সার

Competitors:
- BDTax.com.bd (main competitor — manual consultant model)
- NBR e-Return portal (free but zero guidance)

Our Edge over BDTax:
- BDTax: manual consultants, 3-7 days, no AI, no optimization
- Us: AI-powered, 15 minutes, Investment Optimizer, instant PDF

---

## 2. BUSINESS MODEL & REVENUE

### Pricing Tiers
| Tier | Price | Features |
|------|-------|---------|
| বিনামূল্যে (FREE) | ৳০ | Basic return + PDF download + NBR manual guide |
| স্মার্ট (SMART) | ৳৪৯৯ | FREE + AI optimizer + OCR document scan + priority support |
| প্রো (PRO) | ৳৯৯৯ | SMART + CA expert review within 24 hours |
| কর্পোরেট | ৳২০০-৪০০/কর্মী/বছর | B2B HR bulk filing for companies |

### Revenue Streams
1. PRIMARY: Freemium subscription (FREE → SMART → PRO)
2. SECONDARY: B2B corporate HR bulk filing
3. TERTIARY: Google AdSense (ONLY on /blog and /calculators)
   - NEVER show ads inside filing workflow
   - Trust is critical — ads next to tax forms = lost users
4. FUTURE: CA expert network revenue share
5. FUTURE: API licensing to banks and HR software

### B2B Strategy
- Target: tech companies, NGOs, mid-size banks in Dhaka
- Value: 500 employees × ৳300 = ৳150,000 per company per year
- Process: HR uploads CSV → system generates all returns → HR reviews → submit

---

## 3. NBR CRITICAL CONSTRAINT

NBR (National Board of Revenue) does NOT provide public API.
NO auto-submit to NBR is possible.

Submission flow is ALWAYS manual:
1. Platform generates complete tax return PDF
2. User downloads PDF
3. User goes to etaxnbr.gov.bd manually
4. User logs in with their TIN and password
5. User uploads the PDF
6. User saves acknowledgment number
7. User enters acknowledgment number in our platform

Show these steps clearly on submit page in Bangla.
NEVER say "auto submit to NBR" — it is not possible.

---

## 4. TECH STACK (STRICT — NEVER DEVIATE)

### Allowed
- Next.js 16.2.6 (App Router, TypeScript strict)
- Tailwind CSS v4 (ONLY — no component libraries)
- Better Auth v1.6.10 (NEVER NextAuth)
- MongoDB Atlas + Mongoose 9
- pdf-lib (PDF generation)
- SWR (client-side data fetching)
- Resend (email — free 3000/month)
- SSLCommerz (payment — Bangladesh only)
- Zod (validation)
- bcryptjs (password hashing)

### Never Install
- next-auth or any nextauth package
- prisma, drizzle
- clerk, auth0, supabase
- stripe (not available in Bangladesh)
- aws, firebase
- shadcn, material-ui, chakra-ui, any UI library
- redux, zustand, react-query

### Next.js 16 Specific
- proxy.ts replaces middleware.ts (Next.js 16 standard)
- export function proxy() — not middleware()
- Mongoose 9: use async pre-save hooks (no next() callback)
- MongoClient needs fallback for build time

---

## 5. LANGUAGE RULES (MANDATORY — ZERO EXCEPTIONS)

ALL user-facing text must be in Bangla.

### Bangla Examples
- Buttons: "লগইন করুন" "নিবন্ধন করুন" "সংরক্ষণ করুন"
  "পরবর্তী" "পূর্ববর্তী" "দাখিল করুন" "ডাউনলোড করুন"
- Labels: "ইমেইল" "পাসওয়ার্ড" "পূর্ণ নাম" "মোবাইল নম্বর"
  "TIN নম্বর" "জেলা" "জন্ম তারিখ" "বার্ষিক বেতন"
- States: "লোড হচ্ছে..." "সংরক্ষণ হচ্ছে..." "সফল হয়েছে ✅"
- Errors: "ইমেইল সঠিক নয়" "পাসওয়ার্ড কমপক্ষে ৮ অক্ষর"
- Nav: "ড্যাশবোর্ড" "আমার প্রোফাইল" "ট্যাক্স রিটার্ন"
  "ডকুমেন্ট ভল্ট" "বিনিয়োগ অপটিমাইজার" "লগআউট করুন"

### English Only For
- Variable names in code
- Console.log messages
- URLs and email addresses
- Package names

---

## 6. COMPLETE USER JOURNEY

### Step 1: Landing Page (/)
- Hero: "ট্যাক্স রিটার্ন এখন মাত্র ১৫ মিনিটে"
- Live tax estimator widget: type salary → see instant tax
- Stats: "১৫ মিনিট" | "১০০% নির্ভুল" | "৳০ থেকে শুরু"
- How it works: 3 steps
- Pricing cards: FREE / SMART / PRO
- CTA: "এখনই শুরু করুন — বিনামূল্যে"

### Step 2: Register/Login
- Mobile-first form
- Better Auth email + password
- Auto-redirect to dashboard after success

### Step 3: Dashboard (/dashboard)
- Welcome: "স্বাগতম, [name]!"
- Profile completeness alert if < 70%
- 4 stats cards: Return status, Tax estimate, Savings, Profile %
- Quick actions: Start return, Scan slip, Optimizer, AI Chat
- Tax deadline reminder

### Step 4: AI Interview (/dashboard/return/interview)
- Conversational — NOT a traditional form
- Question 1: User type? SALARIED / FREELANCER / BUSINESS / MIXED
- Questions adapt based on answer
- SALARIED path:
  annual salary → TDS deducted? → investments →
  house rent → medical → bonus → other income
- FREELANCER path:
  foreign remittance → dollar rate → local income →
  4% export incentive → investments
- Session saves after every answer (resumable)
- Live tax counter updates as user answers

### Step 5: Investment Optimizer (/dashboard/optimizer)
- Shows current tax liability
- Shows "invest ৳X more → save ৳Y in tax"
- Based on Section 78 Income Tax Act 2023
- Investment types: সঞ্চয়পত্র, DPS, LIC, stocks, provident fund

### Step 6: Review (/dashboard/return/review)
- Clean summary table
- All income, exemptions, rebates, final tax
- User can edit any field
- Legal disclaimer (mandatory):
  "এই তথ্য আইনি পরামর্শ নয়। চূড়ান্ত দায়িত্ব করদাতার নিজের।"

### Step 7: Submit (/dashboard/return/submit)
- Generate PDF button: "পিডিএফ ডাউনলোড করুন"
- Manual NBR guide (numbered steps in Bangla):
  ১. etaxnbr.gov.bd ওয়েবসাইটে যান
  ২. TIN ও পাসওয়ার্ড দিয়ে লগইন করুন
  ৩. "রিটার্ন দাখিল" বাটনে ক্লিক করুন
  ৪. ডাউনলোড করা PDF আপলোড করুন
  ৫. Submit করুন ও acknowledgment নম্বর সংরক্ষণ করুন
- Input: "আপনার acknowledgment নম্বর লিখুন"

---

## 7. COMPLETE FILE STRUCTURE

```
C:\Projects\taxflowbd\
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (marketing)/
│   │   │   └── page.tsx          ← Landing page
│   │   ├── dashboard/
│   │   │   ├── layout.tsx        ← Protected layout
│   │   │   ├── page.tsx          ← Main dashboard
│   │   │   ├── profile/page.tsx
│   │   │   ├── return/
│   │   │   │   ├── interview/page.tsx
│   │   │   │   ├── review/page.tsx
│   │   │   │   └── submit/page.tsx
│   │   │   ├── optimizer/page.tsx
│   │   │   └── vault/page.tsx
│   │   ├── api/
│   │   │   ├── auth/[...all]/route.ts
│   │   │   ├── profile/route.ts
│   │   │   ├── tax/
│   │   │   │   ├── calculate/route.ts
│   │   │   │   └── optimize/route.ts
│   │   │   └── interview/route.ts
│   │   ├── layout.tsx            ← Hind Siliguri font
│   │   └── globals.css
│   ├── components/
│   │   ├── dashboard/
│   │   │   ├── DashboardSidebar.tsx
│   │   │   ├── DashboardHeader.tsx
│   │   │   ├── StatsCard.tsx
│   │   │   ├── QuickActions.tsx
│   │   │   ├── ProfileAlert.tsx
│   │   │   └── RecentActivity.tsx
│   │   ├── interview/
│   │   │   ├── InterviewShell.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   └── ProgressBar.tsx
│   │   ├── profile/
│   │   │   ├── ProfileForm.tsx
│   │   │   └── ProfileCompleteness.tsx
│   │   ├── landing/
│   │   │   ├── Hero.tsx
│   │   │   ├── HowItWorks.tsx
│   │   │   ├── Features.tsx
│   │   │   ├── Pricing.tsx
│   │   │   └── TaxCalculatorWidget.tsx
│   │   └── shared/
│   │       ├── Navbar.tsx
│   │       ├── Footer.tsx
│   │       └── LogoutButton.tsx
│   ├── lib/
│   │   ├── auth.ts               ← Better Auth server
│   │   ├── auth-client.ts        ← Better Auth client
│   │   ├── mongodb.ts            ← Mongoose connection
│   │   ├── validators.ts         ← Zod schemas
│   │   └── rate-limit.ts         ← Rate limiting
│   ├── models/
│   │   ├── User.ts               ← UserProfile model
│   │   └── TaxReturn.ts
│   ├── engines/
│   │   ├── tax-calculator.ts     ← Core calculation
│   │   ├── rebate-optimizer.ts   ← Section 78 optimizer
│   │   └── salary-decomposer.ts
│   ├── config/
│   │   └── tax-config.ts         ← ALL tax values here
│   └── types/
│       └── index.ts
├── proxy.ts                      ← Next.js 16 (not middleware.ts)
├── next.config.ts                ← Security headers
├── CLAUDE.md                     ← This file
└── .env.local                    ← Never commit to git
```

---

## 8. BETTER AUTH PATTERNS

### Server Component
```typescript
import { auth } from "@/lib/auth"
import { headers } from "next/headers"

const session = await auth.api.getSession({
  headers: await headers(),
})
if (!session) redirect("/login")
const user = session.user
```

### Client Component
```typescript
"use client"
import { useSession, signIn, signOut } from "@/lib/auth-client"

const { data: session, isPending } = useSession()
```

### API Route Auth Check
```typescript
// ALWAYS verify in API routes — never trust proxy.ts alone
const session = await auth.api.getSession({
  headers: await headers(),
})
if (!session) {
  return Response.json(
    { success: false, error: "অননুমোদিত অ্যাক্সেস" },
    { status: 401 }
  )
}
```

---

## 9. API RESPONSE FORMAT

```typescript
// Success
{ success: true, data: {...}, message: "বাংলায়" }

// Error
{ success: false, error: "বাংলায় error message" }
```

### Error Codes
- ERR_AUTH_REQUIRED → লগইন করা নেই
- ERR_INVALID_TIN → TIN যাচাই ব্যর্থ
- ERR_TAX_CALC_FAILED → হিসাব ব্যর্থ হয়েছে
- ERR_PAYMENT_REQUIRED → প্রিমিয়াম ফিচার

---

## 10. TAX CALCULATION RULES

ALL values in src/config/tax-config.ts ONLY.
Never hardcode tax rates anywhere else.

### Current Slabs (AY 2025-26)
- First ৳3,50,000 → 0% (general)
- Women & senior citizens → ৳4,00,000 tax-free
- Disabled & third gender → ৳4,75,000 tax-free
- Next ৳1,00,000 → 5%
- Next ৳4,00,000 → 10%
- Next ৳5,00,000 → 15%
- Next ৳5,00,000 → 20%
- Above → 25%

### Consolidated Allowance
exempt = MIN(৳4,50,000, gross_salary ÷ 3)
Covers: HRA + Medical + Conveyance combined

### Investment Rebate (Section 78)
allowable = MIN(actual, 30% of taxable, ৳1.5 crore)
rebate = 15% of allowable

### Minimum Tax
- Dhaka/Chattogram City Corp: ৳5,000
- Other City Corp: ৳4,000
- Other areas: ৳3,000

---

## 11. DATABASE MODELS

### User (Better Auth creates its own user table)
UserProfile model stores EXTRA tax data:
- betterAuthUserId (link to Better Auth user)
- tin (12 digits, encrypted)
- phone, dateOfBirth, gender
- district, taxpayerType (SALARIED/FREELANCER/BUSINESS/MIXED)
- subscription (FREE/SMART/PRO)
- profileCompleteness (0-100, auto-calculated)
  name:20 + email:20 + phone:15 + tin:25 + dob:10 + district:10

### TaxReturn
- userId, assessmentYear, status (DRAFT/COMPLETE/SUBMITTED)
- income: {basicSalary, houseRent, medical, conveyance,
           bonus, otherAllowances, freelanceIncome,
           businessIncome, otherIncome}
- exemptions: {consolidatedAllowance, totalExempt}
- investments: {sanchayapatra, dps, lifeInsurance,
               stock, providentFund, other}
- calculation: {grossIncome, taxableIncome, taxBeforeRebate,
               investmentRebate, taxAfterRebate,
               minimumTax, finalTax, taxConfigVersion}
- acknowledgmentNumber, submittedAt

---

## 12. SECURITY RULES

Apply to EVERY file created:

1. Double auth: proxy.ts + every API route independently
2. Zod validation on all API inputs
3. Never return password field (select: false in model)
4. Rate limit on all API routes (10 req/min default)
5. Generic Bangla error messages to users
6. Detailed errors only in server console.log
7. Never use NEXT_PUBLIC_ for sensitive data
8. TIN must be encrypted before saving to DB
9. Every sensitive action logged to AuditLog

### Security Headers (next.config.ts)
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Strict-Transport-Security: max-age=63072000

---

## 13. DESIGN GUIDELINES

Font: Hind Siliguri (Google Fonts) for Bangla
Colors:
- Primary: blue-600 (#2563EB)
- Success: emerald-500
- Warning: amber-500
- Danger: red-500
- Background: slate-50
- Card: white
- Text primary: slate-800
- Text secondary: slate-500

Design Principles:
- Mobile-first (Bangladesh is mobile-dominant)
- NO ads inside filing workflow
- Progress indicator on all multi-step flows
- Loading skeleton on all data-fetch components
- Legal disclaimer on every tax result page

AdSense Rules:
- ALLOWED: /blog/* and /calculators/* pages only
- FORBIDDEN: Any dashboard, filing, or review page

---

## 14. PHASE PROGRESS

### Completed
- [x] Phase 1 — Foundation (13 files, build ✅)
  - tax-config.ts, types/index.ts
  - lib/mongodb.ts, lib/auth.ts, lib/auth-client.ts
  - models/User.ts (UserProfile), models/TaxReturn.ts
  - engines/tax-calculator.ts, engines/rebate-optimizer.ts
  - app/api/auth/[...all]/route.ts
  - proxy.ts (Next.js 16)
  - app/layout.tsx (Hind Siliguri), globals.css

### In Progress
- [ ] Phase 2 — Auth pages
  - app/(auth)/register/page.tsx
  - app/(auth)/login/page.tsx
  - components/shared/LogoutButton.tsx

### Pending
- [ ] Phase 3 — Dashboard (layout + page + 6 components)
- [ ] Phase 4 — Profile (API + form + completeness)
- [ ] Phase 5 — Tax Engine API (calculate + optimize)
- [ ] Phase 6 — Interview + Submit flow
- [ ] Phase 7 — Optimizer + Vault pages
- [ ] Phase 8 — Landing page (Hero, Pricing, Calculator widget)

---

## 15. ENVIRONMENT VARIABLES

### .env.local (never commit to git)
```
MONGODB_URI=mongodb+srv://user:pass@cluster/taxflowbd
BETTER_AUTH_SECRET=32-char-random-string
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENCRYPTION_KEY=64-char-hex-string
```

### Vercel Production
```
MONGODB_URI=mongodb+srv://user:pass@cluster/taxflowbd
BETTER_AUTH_SECRET=same-as-local
BETTER_AUTH_URL=https://taxflowbd.vercel.app
NEXT_PUBLIC_APP_URL=https://taxflowbd.vercel.app
ENCRYPTION_KEY=same-as-local
```

---

## 16. WORKTREE RULE (CRITICAL)

ALWAYS work in: C:\Projects\taxflowbd\
NEVER work in: .claude\worktrees\anything\

Before creating any file, confirm path starts with:
C:\Projects\taxflowbd\src\

When installing packages, run in: C:\Projects\taxflowbd\
