# Notification Redesign + Next Useful Features

## Part 1 — New notification experience (replaces the panel you dislike)

Today alerts open in a tall bottom sheet with a title, a description line, filter pills and large rows. It feels heavy for quick glances.

New design: a **compact alert centre** that drops from the bell instead of sliding up from the bottom.

- Anchored card just under the bell (a popover, not a full-height sheet), max 78% of screen height, rounded, with soft shadow.
- Slim header: "Alerts" + unread count chip + a single "Mark all read" text button. No long description text.
- Segments become small icon+label chips in one row: All / Community / Safety.
- **Compact cards**: one line title (truncated), one line detail, small time stamp on the right, 28px tinted icon on the left, 3px accent bar on the left edge for unread. Card height about 58px so five alerts fit without scrolling.
- Grouping by day with tiny sticky labels: Today / Yesterday / Earlier.
- Swipe a card left to dismiss it; tapping keeps current behaviour (marks read, opens the report on the map).
- Empty state reduced to one icon + one line.
- "See all in Activity" link at the bottom for the longer history.
- Motion: cards fade+rise in a short stagger, respecting reduced-motion.

## Part 2 — Features worth adding next

Recommended, in priority order:

1. **Live Ward Feed (home)** — a slim, auto-updating strip of what is happening nearby right now (new reports, marshals on mission, resolutions) so the app feels alive without extra taps.
2. **Report progress promises** — each community report shows an expected action window and a countdown, with automatic "still pending" nudges so people see accountability.
3. **Smart quick-report** — one-tap reporting from a photo: category guessed from the chosen photo tags, location prefilled, 2 taps to submit.
4. **Neighbour groups** — join your street/apartment group, see only its issues, and rally supporters faster.
5. **Civic impact card** — a shareable monthly summary (issues resolved, people helped, trust points earned) with a save-image button.
6. **Marshal shift planner** — marshals pick availability windows and see predicted demand by area, plus earnings estimate.
7. **Offline-first drafts** — reports composed without network are queued and submitted when back online.
8. **Accessibility & language** — Hindi/English toggle, larger-text mode, high-contrast map.

Suggest starting with 1, 2 and 3 in the same pass since they share the report data already in the app.

## Technical notes

- Notification UI: replace the `Drawer` in `NotificationBell` with a `Popover` anchored to the bell; new `.alert-*` styles in `src/styles.css` replacing `.notif-row`; `framer-motion` stagger; swipe-dismiss via drag gesture plus a new `dismissNotification` action in `src/lib/traffic-store.tsx`.
- Day grouping computed from existing `at` timestamps; no data model change beyond the dismiss flag.
- `RecentAlerts` in Activity reuses the same compact card styles for consistency.
- Features in Part 2 build on existing local state and persistence; no backend.
