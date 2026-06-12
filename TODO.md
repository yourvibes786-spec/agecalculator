# V2 Incremental Implementation Plan (Age Calculator)

## Step 1 — Life Progress Dashboard
- Add new UI elements (life expectancy, weeks/months/years remaining).
- Add utilities:
  - parse birth date/time (already exists in AgeCalculator)
  - compute remaining time to chosen life expectancy date
- Persist preferences (life expectancy + user options) to localStorage.
- Wire into `runCalculations()` without removing existing functionality.

## Step 2 — Planetary Age Explorer
- Add utilities to compute planetary age (Mercury, Venus, Mars, Jupiter, Saturn) based on orbital periods.
- Add UI section + wire into `runCalculations()`.

## Step 3 — Advanced Milestone Center
- Ensure milestone roadmap includes:
  - 10,000 days and 20,000 days milestones
  - Next birthday milestone highlight (already present)
- Add extra “milestone” UI blocks if needed (secondary center).

## Step 4 — Life Statistics Intelligence
- Add utilities + UI for:
  - weekends lived
  - leap years witnessed
  - Olympics count (approximate by year)
  - World Cups count (approximate by year)
  - sunrises lived (approximate)
  - full moons (approximate)
- Keep computations local/offline.

## Step 5 — Shareability Upgrade
- Upgrade “Copy summary” + add Web Share API button.
- Add share text builder used by both copy + web share.
- Keep existing share card PNG + copy button.

## Step 6 — Premium Personal Profile
- Add profile name input and preferences persistence (localStorage).
- Display name in “Personal Profile”.

## Step 7 — Dark Mode System
- Add dark mode toggle (system default + persisted preference).
- Update theme via CSS variables / class on body, without breaking Vercel-inspired look.

## Step 8 — Premium UX polish + performance
- Reduce DOM work in ticking loop (batch updates).
- Add subtle transitions for new panels.
- Improve mobile/tablet layout (responsive grid adjustments).
- Add basic throttling if needed (still 1s tick).

## Deliverable
- After all steps: report every modified/created file.
