# Plan: Make Activity a Civic Command Center

## Goal

Turn the currently sparse Activity screen into a useful, polished daily hub for Nagrik citizens: active safety, community impact, nearby civic issues, saved places, and clear next actions in one mobile-first experience.

## What will change on this screen

1. **Top summary that feels alive**
   - Replace the empty-feeling top area with a compact “Today in your area” panel.
   - Show nearby active issues, marshals online, pending petitions, SafeWalk readiness, and unread civic updates.
   - Add quick actions for: log issue, request marshal, start SafeWalk, and view alerts.

2. **Better Activity tabs**
   - Keep the existing Active / Reports / Resolved / Ward structure, but make each tab feel complete.
   - Active: show live request, SafeWalk, adopted-spot alerts, petition progress, and pending marshal requests.
   - Reports: show the citizen’s submitted reports plus community reports they supported.
   - Resolved: show before/after evidence, impact, people helped, and verified outcome.
   - Ward: improve the leaderboard with contribution cards, rank movement, and neighbourhood progress.

3. **New “Watchlist” convenience layer**
   - Add saved/adopted spots as a visible section, not hidden inside a report detail.
   - Show which saved spots have new issues, verified updates, or petition movement.
   - Add one-tap actions: open on map, mute spot, request marshal for a spot issue.

4. **Community impact timeline**
   - Add a timeline that combines: reports filed, people who supported, petitions signed, marshal claimed, resolved, and SafeWalk completed.
   - Make it visually richer with clear icons, status chips, and short human-readable updates.

5. **Smarter empty states**
   - Replace “Nothing active right now” with a useful civic dashboard empty state.
   - Suggest actions based on the app’s purpose: check nearby map reports, start SafeWalk, adopt a common route, or log a civic issue.

6. **More interactive UI polish**
   - Add compact animated counters, progress bars, and small celebratory state changes when users support, sign, or adopt.
   - Keep the professional green theme and avoid making it look like a cab-booking flow.
   - Make the screen scroll naturally with enough bottom spacing above the navigation bar.

## Additional useful features to add

- **Neighbourhood pulse**: “12 reports this week · 4 resolved · 3 need support”.
- **Issue urgency score**: combines supporters, age, priority, and marshal requests.
- **Trusted routes**: saved routes for daily commute, school pickup, evening walk, market route.
- **Family safety snapshot**: show trusted contacts and last SafeWalk status.
- **Civic reminders**: prompts to add evidence, sign a petition near goal, or check an adopted spot.
- **Micro-achievements**: “First report”, “3 neighbours helped”, “SafeWalk complete”, “Petition signer”.
- **Marshal availability strip**: small live indicator showing verified help coverage nearby.

## Technical details

- Extend the local Nagrik store with derived activity data only; no backend will be added.
- Add a richer `ActivityCenter` layout and small reusable sections inside the existing app structure.
- Use current Eucalyptus design tokens, existing Button components, and semantic Tailwind classes.
- Keep all interactions synchronized with the existing shared local state: reports, petitions, adopted spots, SafeWalk, notifications, and active jobs.
- Verify the Activity screen on mobile and tablet, including scrolling, tab switching, and bottom navigation spacing.
