# Phase 3: Dashboard - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the authenticated home screen: a sidebar layout with a persistent left nav (mobile drawer on small screens), a Header component, 3 StatsCards, an inline ProfileAlert card, a QuickActions row (4 actions), and a RecentActivity feed. All text in Bangla. No new API routes — data comes from session + UserProfile + latest TaxReturn DB fetch inside the dashboard page server component.

</domain>

<decisions>
## Implementation Decisions

### Nav Structure
- **D-01:** Sidebar layout — fixed left panel on desktop (~240px), hamburger-triggered slide-in drawer on mobile. Component: `src/components/dashboard/Sidebar.tsx`.
- **D-02:** 3 nav links only: ড্যাশবোর্ড (`/dashboard`), ট্যাক্স রিটার্ন (`/dashboard/return/interview`), আমার প্রোফাইল (`/dashboard/profile`). Vault and Optimizer links are deferred until their phases are built.
- **D-03:** LogoutButton pinned to bottom of sidebar. Reuse the existing `src/components/shared/LogoutButton.tsx` component.
- **D-04:** Header shows page title on the left and a personalized Bangla greeting on the right: `স্বাগত, [firstName]!` (sourced from session user name). Component: `src/components/dashboard/Header.tsx`.

### Stats Content
- **D-05:** StatsCard row renders 3 cards: (1) প্রোফাইল সম্পন্ন — `profileCompleteness`% from UserProfile, (2) রিটার্নের অবস্থা — latest TaxReturn status (`DRAFT` / `SUBMITTED` / `নেই`), (3) মূল্যায়ন বছর — static `AY 2025-26`. Component: `src/components/dashboard/StatsCard.tsx` (single component, rendered 3× with different props).
- **D-06:** `src/app/dashboard/page.tsx` fetches: (1) session via `auth.api.getSession()`, (2) UserProfile from DB via `betterAuthUserId`, (3) latest TaxReturn for the user (sort by `createdAt` desc, limit 1). All fetches are server-side; data is passed as props to client components.

### RecentActivity Empty State
- **D-07:** When no TaxReturn exists, RecentActivity shows a Bangla onboarding prompt with a CTA button: **"এখনই শুরু করুন"** that navigates to `/dashboard/return/interview`. When a TaxReturn exists, show the return's status + last updated date. Component: `src/components/dashboard/RecentActivity.tsx`.

### ProfileAlert
- **D-08:** Renders as an inline card in the main content area — positioned between StatsCard row and QuickActions row. Not a top banner. Component: `src/components/dashboard/ProfileAlert.tsx`.
- **D-09:** Visible when `profileCompleteness < 100`. Hidden when `profileCompleteness === 100` (no partial threshold — must be fully complete).
- **D-10:** Alert content: progress bar showing `profileCompleteness`%, percentage text (e.g., `২৫% সম্পন্ন`), and a `প্রফাইল সম্পন্ন করুন` button linking to `/dashboard/profile`.
- **D-11:** At 100%, briefly render a success state — `প্রফাইল সম্পন্ন ✅` — then unmount the card (can use a short CSS transition or a `setTimeout` fade-out).

### QuickActions
- **D-12:** 4 action cards in a grid: (1) রিটার্ন শুরু করুন → `/dashboard/return/interview`, (2) খসড়া দেখুন → `/dashboard/return/interview` (resumes existing draft), (3) বিনিয়োগ অপ্টিমাইজ → coming-soon page, (4) ডকুমেন্ট আপলোড → coming-soon page. Component: `src/components/dashboard/QuickActions.tsx`.
- **D-13:** Actions 3 and 4 (Optimizer, Upload) are fully clickable links — they route to a `শীঘ্রই আসছে` placeholder page (not disabled/dimmed). A simple placeholder page is needed: `src/app/dashboard/coming-soon/page.tsx`.
- **D-14:** "রিটার্ন শুরু করুন" navigates unconditionally to `/dashboard/return/interview` — no profile completeness gate at the QuickAction level. The interview flow handles incomplete profiles.

### Claude's Discretion
- Exact sidebar width, card shadow depth, icon choices — use established Tailwind brand tokens and match the visual style from auth pages.
- Dashboard layout grid (responsive breakpoints for the main content area) — follow mobile-first convention.
- Coming-soon placeholder page content — minimal Bangla message is fine.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project Requirements
- `docs/project_spec.md` — Build Phases table (Phase 3 scope), User Journey, API Specs, Key Constraints

### Codebase Maps
- `.planning/codebase/CONVENTIONS.md` — Tailwind CSS v4 brand tokens, Bangla text requirements, component patterns, skeleton loader pattern
- `.planning/codebase/STRUCTURE.md` — Where to place new dashboard components and pages

### Key Source Files
- `src/lib/auth.ts` — `auth.api.getSession({ headers: await headers() })` pattern for server-side session check in layout/page
- `src/components/shared/LogoutButton.tsx` — Reusable logout component; accepts optional `className` prop
- `src/models/User.ts` — `UserProfile` model; `profileCompleteness` field drives ProfileAlert visibility
- `src/models/TaxReturn.ts` — `TaxReturn` model; `status` field (`DRAFT`/`SUBMITTED`) displayed in StatsCard and RecentActivity
- `src/types/index.ts` — `UserProfileData`, `TaxReturnData` types for prop typing

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/shared/LogoutButton.tsx` — Drop into Sidebar bottom; accepts `className` for style overrides
- Tailwind brand tokens (`bg-brand-surface`, `text-brand-primary`, `text-brand-accent`, `bg-brand-primary`) — already defined in `globals.css`, use throughout dashboard
- `animate-pulse` skeleton pattern — established in auth pages; replicate for dashboard loading states

### Established Patterns
- `"use client"` on interactive components (all dashboard components that use state or effects)
- `layout.tsx` is a server component that calls `auth.api.getSession()` and redirects to `/login` if no session — this is the auth gate for all dashboard routes
- Functional updater state pattern: `setForm(f => ({ ...f, field: value }))`
- Mobile-first layout: `min-h-screen flex` base; sidebar pattern extends this

### Integration Points
- `src/app/dashboard/layout.tsx` — new file; wraps all `/dashboard/*` routes; contains Sidebar and session auth check
- `src/app/dashboard/page.tsx` — fetches UserProfile + TaxReturn; passes data as props to StatsCard, ProfileAlert, QuickActions, RecentActivity
- `proxy.ts` — already guards `/dashboard/*` at the edge; layout.tsx adds a second auth check per the double-auth rule

</code_context>

<specifics>
## Specific Ideas

- Dashboard layout: left sidebar (fixed, not scrollable) + right main content area (scrollable). On mobile, sidebar collapses behind a hamburger.
- Placeholder coming-soon page needed at `src/app/dashboard/coming-soon/page.tsx` — a single Bangla message page, not a component.
- RecentActivity "এখনই শুরু করুন" CTA: style it as a prominent outlined button, consistent with the button patterns in auth pages but secondary style (not filled).

</specifics>

<deferred>
## Deferred Ideas

- Vault nav link — deferred to Phase 7 (Optimizer + Vault)
- Optimizer nav link — deferred to Phase 7
- Notification bell in Header — deferred (no backend for notifications yet)
- Profile completeness gate on "Start Return" — deferred to Phase 6 (Interview flow handles incomplete profiles)

</deferred>

---

*Phase: 3-Dashboard*
*Context gathered: 2026-05-11*
