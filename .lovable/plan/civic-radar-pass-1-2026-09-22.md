# Civic Radar Pass 1

## Goal

Turn the existing stylized map into an interactive Civic Radar that shows local civic hazards and keeps verification status synchronized across requester and marshal journeys.

## Experience

- Add a compact Civic Radar layer control for hazards, active requests, and verified items.
- Place tappable hazard pins for representative civic categories around the current Hauz Khas map.
- Open a concise hazard detail panel from each pin with category, distance, report count, freshness, and verification state.
- Let the requester select a reported hazard as the issue source and continue into the existing request flow.
- Show the active request as a shared highlighted pin for both personas.
- Synchronize verification through the existing lifecycle: reported while finding, marshal assigned after acceptance, on-site verification during the mission, evidence verified near completion, and resolved after archive.

## Shared state

- Add persistent hazard selection and verification fields to the local shared store.
- Derive verification labels from the mission stage so requester and marshal views cannot disagree.
- Reset hazard linkage safely when the active demo request is cleared.

## Verification

- Test layer toggles and hazard pin details on phone and tablet widths.
- Create a request from a hazard pin and confirm the same issue and verification state appear for the marshal.
- Advance the mission and confirm both views reflect the same verification progression without browser errors.
