# Redesign the Civic Action Panel and Simulator

## Civic action panel

- Replace the current large white sheet with a compact, layered action dock that keeps the map visually dominant.
- Give the three actions clearer hierarchy:
  - **Report for everyone** as the primary community action.
  - **Get personal help** as the urgent, high-contrast action.
  - **SafeWalk** as a quieter safety shortcut.
- Use the existing eucalyptus system with distinct semantic treatments, stronger icon containers, cleaner labels, restrained depth, and accessible contrast rather than two visually similar large buttons.
- Add a dedicated collapse control and draggable-looking handle. Collapsing will animate the panel into a small map-edge pill showing only an expand control and the two most useful status cues, leaving the map unobstructed.
- Preserve the expanded/collapsed choice while the requester remains on the map screen; active-request information will still remain reachable.
- Add lightweight micro-interactions: spring-like panel reveal, staggered action entrance, tactile press feedback, icon movement, and a subtle online-status pulse. Respect reduced-motion settings and avoid continuous heavy animation.
- Keep all controls at least 44px, with clear accessible names, keyboard focus, and layouts that remain balanced on phone and tablet.

## Simplified simulator

- Replace the current multi-section prototype console with a minimal two-control utility.
- **Profile switcher:** only Requester and Marshal, presented as a clear two-way segmented switch; remove Admin.
- **Status control:** one compact status selector that displays the current lifecycle state and lets the user move directly to another state.
- Remove create, evidence, escalation, archive, availability, KYC, training, reset, and duplicate lifecycle controls from the simulator.
- Keep the shared local synchronization unchanged, so switching profile or status immediately updates both journeys.
- Make the simulator shorter, calmer, and easier to dismiss, with concise current-request context only when a request exists.

## Technical details

- Update the requester home panel state and presentation without changing the existing community, personal-help, SafeWalk, map, or job lifecycle logic.
- Reuse the existing shared store for persona and lifecycle state; derive simulator labels from the current state rather than duplicating data.
- Add focused semantic styles and motion keyframes to the existing design system, including reduced-motion fallbacks.
- Remove obsolete simulator-only imports and dead UI branches after simplification.

## Verification

- Verify expanded and collapsed map states at 390px, 491px, and tablet width.
- Confirm every civic action still opens its existing flow and the panel can always be restored.
- Confirm requester/marshal switching and direct status changes remain synchronized.
- Check touch targets, focus labels, text fit, animation smoothness, and browser console errors.
