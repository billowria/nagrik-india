# Civic Commons: Community Reports and Personal Help

## Goal

Replace the cab-booking-style request journey with a civic-first system that clearly separates shared neighbourhood issues from immediate personal assistance.

## Experience

- Replace “Hold to Request” with two distinct entry points: **Report for the community** and **Get personal help now**.
- Give community reporting a calm five-part flow: issue, place, evidence, community context, publish.
- Let a report be published to the Civic Map without automatically dispatching or charging for a marshal.
- Give personal help a shorter urgency-led flow that ends in a direct marshal request.
- Keep SafeWalk separate as a citizen safety tool.

## Community map

- Persist user-created civic reports with image state, reporter identity, location, freshness, verification, supporter count, and marshal-request count.
- Render new reports as map pins and open a community detail sheet with evidence, impact, progress, and contributor context.
- Let neighbours confirm “This affects me” once per report and increase the visible collective count.
- Let a neighbour request a marshal from a shared issue; multiple requests aggregate into one mission rather than creating duplicate jobs.
- Show that one accepted marshal mission can serve everyone attached to the report.

## Marshal journey

- Distinguish **community mission** from **personal assistance** in incoming, mission, evidence, payout, and history views.
- For community missions, show affected people, request count, report evidence, shared location, and the collective outcome.
- Keep one synchronized mission lifecycle and one archive/payout action for the shared report.

## Design language

- Use the existing Eucalyptus system, Sora/Manrope typography, compact orange/red map hazards, and neon-green progress treatment.
- Use civic language such as “Publish report,” “Support this report,” “Request community marshal,” and “People helped.”
- Avoid ride-hailing cues: no arrival-first framing, fare-first cards, driver-style matching, or “book now” language.
- Use an open civic-led composition with evidence, neighbourhood impact, and trust signals as the visual hierarchy.

## Technical details

- Extend the persistent local store with community reports and report actions while preserving existing saved prototype data.
- Keep personal jobs, shared community missions, and SafeWalk sessions explicit through job/report kinds.
- Add duplicate guards for publishing, supporting, marshal requests, mission acceptance, and archiving.
- Reuse the existing mock map coordinates and local-only persistence; no backend is added.

## Verification

- Publish a photo-backed community report and confirm it appears on the map after reopening the app.
- Support the report and request a marshal from its map detail; confirm counts update once without duplicate missions.
- Switch to the marshal persona and complete the shared mission, confirming the requester view and history reflect people helped.
- Run the personal-help flow separately and confirm it remains immediate and private.
- Check phone and tablet layouts, touch targets, persistence, and browser errors.
