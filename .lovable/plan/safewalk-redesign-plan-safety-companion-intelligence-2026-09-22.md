# SafeWalk Redesign Plan — Safety Companion Intelligence

## Goal

Turn SafeWalk from a simple setup form into a complete safety companion feature: more reassuring, more animated, more informative, and more useful during a real walk.

The redesigned SafeWalk should feel different from booking a ride. It should feel like a personal protection layer powered by your trusted circle, community safety signals, and nearby verified marshals.

## Experience direction

SafeWalk will become a dedicated safety journey with three clear states:

1. **Before the walk** — understand route safety, choose protection level, choose contacts, and start confidently.
2. **During the walk** — live safety status, animated progress, check-ins, route awareness, trusted-circle visibility, and fast escalation.
3. **After the walk** — safe-arrival summary, trust score growth, route learning, and useful history.

## Screen redesign

### 1. SafeWalk Command Header

Replace the plain heading with a safety-focused header:

- Destination and estimated walk duration.
- Current protection status: Standard, Guarded, or High Alert.
- Nearby marshal availability.
- Animated green safety shield indicator.
- Clear back action that returns to the home map.

### 2. Safer Map Preview

Upgrade the map card into an informational route preview:

- Animated route corridor from current location to destination.
- Mock safety beacons along the route.
- Nearby civic hazards shown as compact red/orange markers.
- Green “safe zones” near shops, metro gates, police booths, and lit areas.
- Route confidence score, such as “82% safer corridor”.
- Recenter and route-detail controls.

### 3. Protection Level Selector

Add a new selector before starting:

- **Quiet Watch** — share progress with trusted contact only.
- **Guarded Walk** — trusted contact plus marshal monitoring.
- **High Alert** — frequent check-ins, marshal standby, SOS-ready state.

Each mode changes the UI copy, check-in frequency, route badge, and active-walk controls.

### 4. Trusted Circle Panel

Make contacts feel more useful:

- Show primary trusted contact.
- Show who gets notified when the walk starts.
- Add mock backup contact cards.
- Show notification status: “Ready to notify”, “Watching”, or “Alerted”.
- Keep editing simple inside the prototype.

### 5. Smart Check-in Plan

Show how SafeWalk protects the user before they start:

- Check-in schedule based on duration.
- Missed check-in escalation ladder.
- “I’m okay” action preview.
- Privacy note in a compact safety card.

### 6. Live SafeWalk Mode

Redesign the active state into a fixed, scroll-safe bottom panel:

- Animated route progress ring or rail.
- Live elapsed time.
- Next check-in countdown.
- Current phase: Started, On route, Check-in due, Near destination, Arrived.
- Pause/resume sharing.
- “I’m okay” button.
- “Arrived safely” primary action.
- SOS/escalate button, visually serious but not overwhelming.

### 7. Safety Feed During Walk

Add a compact live feed:

- “Priya is watching your walk.”
- “Marshal Riya available 420 m away.”
- “You passed a verified safe zone.”
- “Next check-in in 3 min.”
- “Route has 2 community hazards nearby.”

The feed should be scrollable and fixed-height so it never pushes the controls off-screen.

### 8. Safe Arrival Summary

After finishing SafeWalk, show a polished summary:

- Duration completed.
- Check-ins completed.
- Trusted contact notified.
- Route safety score.
- Trust score points earned.
- Save route / repeat route option for future prototype use.

## Big data implementation plan

This will be implemented as a rich local mock-data system first, so the prototype remains fast and does not need a backend.

### New mock data groups

Add structured data for:

- **Safety zones**: metro gates, hospitals, police booths, lit streets, open shops.
- **Risk signals**: isolated stretches, civic hazards, low-light areas, road damage, blocked paths.
- **Route segments**: distance, walk time, risk score, lighting score, crowd score.
- **Trusted contacts**: status, relation, notification readiness, last alerted time.
- **Marshal presence**: nearby marshals, distance, availability, response estimate.
- **Check-in events**: scheduled time, completed time, missed state, escalation state.
- **SafeWalk history**: route, duration, score, outcome, earned trust points.

### Derived safety intelligence

Use the mock data to calculate:

- Route safety score.
- Recommended protection level.
- Next check-in time.
- Escalation status.
- Nearby help availability.
- Safe zone count.
- Route risk explanation.
- Post-walk trust score impact.

### Local persistence

Persist SafeWalk preferences and history locally:

- Last destination.
- Preferred trusted contact.
- Preferred protection level.
- Completed SafeWalk summaries.
- Intro walkthrough seen state.

### Future real-data upgrade path

If this later becomes a real production feature, the same structure can move into Lovable Cloud:

- Store SafeWalk sessions securely.
- Store trusted contacts and consent preferences.
- Sync live check-ins across devices.
- Power marshal dashboards with live SafeWalk alerts.
- Analyze neighbourhood risk patterns over time.
- Generate safer-route recommendations from real civic reports.

## Animation plan

Use Framer Motion for purposeful safety animations:

- Animated shield pulse when protection is active.
- Route drawing animation on the map preview.
- Step-by-step protection mode transitions.
- Live check-in countdown motion.
- Safety feed items sliding in as events happen.
- Arrived-safely completion celebration.

Animations will respect reduced-motion settings.

## UI/UX rules for this redesign

- Mobile-first, with tablet spacing refined.
- No oversized cards that push key actions off-screen.
- Primary controls always visible in live mode.
- Scroll only within long informational sections.
- Keep SOS accessible but visually distinct from normal actions.
- Use the existing professional green Nagrik theme.
- Use compact 3D-style safety icons where helpful, not 3D animation.

## Implementation phases

### Phase 1 — Data foundation

- Extend the local SafeWalk model with protection level, safety score, route segments, safety zones, risk signals, contacts, check-ins, and history.
- Add helper calculations for safety score, next check-in, route confidence, and escalation ladder.

### Phase 2 — Setup redesign

- Replace the current SafeWalk setup with the new command-style screen.
- Add route preview, protection selector, trusted-circle panel, smart check-in plan, and privacy card.
- Keep the current first-visit animated walkthrough, but visually align it with the new SafeWalk design.

### Phase 3 — Live mode redesign

- Rebuild the active SafeWalk panel with animated progress, next check-in countdown, fixed action area, and scrollable safety feed.
- Add protection-level-specific messaging and controls.
- Keep pause, check-in, finish, and escalate actions working with the shared state.

### Phase 4 — Summary and history

- Add safe-arrival summary after completion.
- Add SafeWalk history entries with route score, check-ins, and trust score impact.
- Surface recent SafeWalk outcomes in Activity/Profile where appropriate without overloading those screens.

### Phase 5 — Verification

- Test on mobile and tablet widths.
- Verify setup, first-visit walkthrough, start, pause/resume, check-in, escalation, safe arrival, and return-to-home flows.
- Check that long feeds stay fixed-height and scrollable.
- Confirm there are no console errors.

## What will stay unchanged

- No backend will be added for this pass.
- The existing requester/marshal synchronized prototype flow remains intact.
- The Nagrik green visual identity stays consistent.
- The existing Home, Activity, Profile, and marshal screens will only be touched where SafeWalk integration requires it.
