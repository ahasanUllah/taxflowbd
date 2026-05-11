# Phase 3: Dashboard - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-11
**Phase:** 3-Dashboard
**Areas discussed:** Nav structure, Stats content, ProfileAlert behavior, QuickActions content

---

## Nav Structure

### Primary layout

| Option | Description | Selected |
|--------|-------------|----------|
| Sidebar (left) + mobile drawer | Desktop: fixed left sidebar. Mobile: hamburger-triggered slide-in drawer. | ✓ |
| Bottom nav bar (mobile-first) | Fixed bottom bar on mobile, expands to sidebar on desktop. | |
| Top header nav only | Single horizontal header, limited to 4-5 items. | |

**User's choice:** Sidebar (left) + mobile drawer

---

### Nav links

| Option | Description | Selected |
|--------|-------------|----------|
| 5 links: Dashboard, Tax Return, Profile, Vault, Optimizer | Full feature set upfront. | |
| 3 links: Dashboard, Tax Return, Profile (others deferred) | Minimal sidebar — Vault and Optimizer added when phases are built. | ✓ |
| You decide | Claude's discretion. | |

**User's choice:** 3 links only — Vault and Optimizer deferred.

---

### LogoutButton placement

| Option | Description | Selected |
|--------|-------------|----------|
| Pinned to bottom of sidebar | Standard SaaS pattern — clear separation from nav links. | ✓ |
| In the Header component (top-right) | Familiar from most web apps. | |
| Both — user name in header, logout in sidebar bottom | Redundant but very visible. | |

**User's choice:** Pinned to sidebar bottom.

---

### Header content

| Option | Description | Selected |
|--------|-------------|----------|
| Page title + greeting (স্বাগত, [name]!) | Page name left, personalized Bangla greeting right. | ✓ |
| Page title only | Minimal, no greeting. | |
| Greeting + notification bell icon | Greeting plus bell for future notifications. | |

**User's choice:** Page title + personalized greeting.

---

## Stats Content

### StatsCard data

| Option | Description | Selected |
|--------|-------------|----------|
| Profile completeness + Return status + Tax year | All available from UserProfile + TaxReturn without calculation. | ✓ |
| Tax liability estimate + Savings left + Return status | Requires calling tax engine — needs income data. | |
| Return status + Filing deadline + Profile completeness | Deadline countdown creates urgency. | |

**User's choice:** Profile completeness + Return status + Tax year (AY 2025-26).

---

### Data fetch scope for page.tsx

| Option | Description | Selected |
|--------|-------------|----------|
| Session + UserProfile only | Simpler — no TaxReturn DB call. | |
| Session + UserProfile + latest TaxReturn | Full dashboard data — adds one DB query. | ✓ |
| You decide | Claude's discretion. | |

**User's choice:** Session + UserProfile + latest TaxReturn.

---

### RecentActivity empty state

| Option | Description | Selected |
|--------|-------------|----------|
| "এখনই শুরু করুন" CTA to start return | Empty state becomes conversion moment. | ✓ |
| Static tips about filing (Bangla help text) | Educational content while list is empty. | |
| Just "কোনো কার্যক্রম নেই" | Minimal Bangla message, no CTA. | |

**User's choice:** "এখনই শুরু করুন" with CTA to /dashboard/return/interview.

---

## ProfileAlert Behavior

### Alert style

| Option | Description | Selected |
|--------|-------------|----------|
| Soft banner at top of page — not dismissible | Persistent yellow/orange banner above stats cards. | |
| Inline card in main content area | Card between stats and quick actions; gone at 100%. | ✓ |
| Blocking modal on first login, then soft banner | Modal on first visit, banner on subsequent. | |

**User's choice:** Inline card in main content area.

---

### Visibility threshold

| Option | Description | Selected |
|--------|-------------|----------|
| 100% complete (all required fields) | Alert hidden only at profileCompleteness === 100. | ✓ |
| Minimum viable for filing (≥ 80%) | Hidden when enough fields filled to start a return. | |
| You decide | Claude's discretion. | |

**User's choice:** 100% — must be fully complete.

---

### Alert content

| Option | Description | Selected |
|--------|-------------|----------|
| Progress bar + percentage + "প্রফাইল সম্পন্ন করুন" button | Visual progress bar, motivating. | ✓ |
| Just a Bangla message + "এখনই যান" button | Simple text alert + link. | |
| You decide | Claude's discretion. | |

**User's choice:** Progress bar + percentage + button.

---

### Success state

| Option | Description | Selected |
|--------|-------------|----------|
| Only shows when incomplete — hidden entirely at 100% | Clean: card just disappears. | |
| Shows success card "প্রফাইল সম্পন্ন ✅" briefly, then disappears | Brief confirmation before hiding. | ✓ |
| You decide | | |

**User's choice:** Brief success state "প্রফাইল সম্পন্ন ✅" then unmount.

---

## QuickActions Content

### Actions

| Option | Description | Selected |
|--------|-------------|----------|
| 3 actions: Start Return / Continue Draft / Optimize | Core tax filing intents. | |
| 4 actions: Start Return / Continue Draft / Optimize / Upload | Adds Document Upload as 4th card. | ✓ |
| 2 actions: Start Return / Continue Draft | Only actions that work in Phase 3. | |

**User's choice:** 4 actions — all shown.

---

### Future actions (Optimizer, Upload) in Phase 3

| Option | Description | Selected |
|--------|-------------|----------|
| Dimmed/disabled with "শীঘ্রই আসছে" badge | Visible but non-interactive. | |
| Fully clickable → "শীঘ্রই আসছে" placeholder page | All 4 active; unbuilt features show coming-soon page. | ✓ |
| Only show the 2 working actions | Hide Optimizer and Upload until built. | |

**User's choice:** Fully clickable, route to coming-soon placeholder.

---

### Profile gate on "Start Return"

| Option | Description | Selected |
|--------|-------------|----------|
| Yes — redirect to Profile if incomplete | Prevents broken return creation. | |
| No — always navigate to interview | Interview flow handles incomplete data. | ✓ |
| You decide | | |

**User's choice:** No gate — navigate unconditionally to interview.

---

## Claude's Discretion

- Exact sidebar width, card shadows, icon choices — follow Tailwind brand tokens
- Dashboard grid breakpoints — mobile-first convention
- Coming-soon placeholder page content — minimal Bangla message

## Deferred Ideas

- Vault nav link — Phase 7
- Optimizer nav link — Phase 7
- Notification bell in Header — no backend yet
- Profile gate on "Start Return" — deferred to Phase 6 (interview handles it)
