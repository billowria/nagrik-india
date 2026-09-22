# Citizen Safety Hub Pass 2

## Goal

Add SafeWalk Companion Mode as the first Citizen Safety Hub flow, using the same persistent shared lifecycle as civic requests.

## Experience

- Add a Safety Hub entry on requester Home without changing the three-tab navigation.
- Build a focused SafeWalk setup for destination, expected duration, trusted contact, and optional marshal monitoring.
- Start a live walk session with elapsed time, progress, location check-ins, pause/resume, and a prominent safety escalation action.
- Show the active SafeWalk on the map and in requester status with clear privacy and sharing states.
- Surface SafeWalk monitoring to the marshal through the existing incoming and mission experience when marshal support is requested.
- Finish or cancel safely, archive the session once, and return both personas to their idle state.

## Shared lifecycle

- Extend the persistent local store with a job kind and SafeWalk session details.
- Reuse the existing stages for requester/marshal synchronization while giving SafeWalk stages their own labels.
- Prevent duplicate starts, acceptance, escalation, and archive actions.

## Verification

- Run the requester setup and live companion flow on phone and tablet.
- Confirm the marshal sees the same SafeWalk session and verification status.
- Test completion, escalation, persistence, safe-area placement, and browser errors.
