# TrafficMitra interactive prototype

## Goal

Build a polished, mobile-first roadside assistance prototype with synchronized requester and marshal journeys, persistent local demo state, complete onboarding, and a functional lifecycle simulator.

## Product structure

- Replace the blank opening screen with an animated TrafficMitra splash and role selection.
- Add all requested requester, onboarding, marshal, mission fallback, history, wallet, and profile routes.
- Keep the marshal’s live mission inside the Home experience while preserving deep-link compatibility routes.
- Add route-specific page titles and social metadata.

## Shared experience

- Create one persistent local store for persona, onboarding, availability, active request, mission stage, evidence, earnings, and history.
- Make requester and marshal screens react instantly to the same lifecycle state.
- Prevent duplicate acceptance, evidence, payout, and archive actions.
- Add valid shortcuts for cancellation, decline, timeout, escalation, evidence, payout, and completion.

## Requester journey

- Build map-first Home, true one-second hold-to-request control, four-step request flow, and synchronized live status views.
- Add Activity and Profile with exactly three navigation tabs.
- Include request confirmation, accepted marshal details, progress statuses, receipt, rating, and feedback.

## Marshal journey

- Build KYC capture/review, five training lessons, three-question quiz, and unlock gates.
- Build a map-first Home with availability, incoming request notification, acceptance, and adaptive mission sheet.
- Add navigation, on-site safety checklist, resolution checklist, evidence, escalation, payout, and archive flows.
- Add Requests/History, editorial Wallet with withdrawal flow, and Profile/support/settings with exactly four navigation tabs.

## Visual and interaction system

- Create a light-only warm-white, cream, orange, navy, green, red, and blue-gray token system.
- Use responsive glass headers, restrained shadows, stable bottom sheets, safe-area spacing, accessible touch targets, and narrow-screen-safe progress rails.
- Add calm motion for splash, headers, sheets, markers, progress, incoming requests, evidence, and payout; respect reduced-motion preferences.
- Use a custom stylized map surface throughout without external services.

## Dev Console

- Add an unobtrusive global arrow trigger and cream bottom-sheet console.
- Include persona switching, route/state inspection, lifecycle timeline, stage controls, reset, availability, KYC, and training controls.
- Ensure the collapsed trigger never blocks primary controls.

## Verification

- Exercise the complete requester-to-marshal lifecycle in the browser, including acceptance, checklists, evidence, payout, archive, and wallet update.
- Check mobile widths from 320–430px and a desktop viewport for clipping, overlap, safe-area issues, and hidden actions.
- Verify representative deep links, onboarding gates, cancellation/escalation outcomes, persistence, and no browser errors.
