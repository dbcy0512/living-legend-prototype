# UI Asset Intake

PixelLab generation date: 2026-05-20.

## Accepted Runtime Candidates

- `hotbar-slot-empty-v1.png`
  - Source: PixelLab map object `bb966fd6-412c-4f0e-81a8-a85e05a75cfa`.
  - Use: base hotbar slot frame.
  - Reason accepted: handmade bark/leather read, transparent center, good at small size.

- `hotbar-slot-locked-v1.png`
  - Source: PixelLab map object `50444c2f-0c52-4895-92cd-7798a7b32971`.
  - Use: locked/disabled hotbar slot.
  - Reason accepted: crossed binding cord communicates unavailable without text.

- `hotbar-selected-overlay-v1.png`
  - Source: PixelLab map object `4f4d6eed-055d-4118-8ffd-283599eadfa3`.
  - Use: selected-slot overlay drawn above the base slot.
  - Reason accepted: transparent center and strong warm focus. Use sparingly so it does not make the hotbar feel magical too early.

- `satchel-panel-v1.png`
  - Source: PixelLab map object `9ddea802-34e0-49ca-b1d4-ed5bc2d8c8d9`.
  - Use: inventory/satchel panel background.
  - Reason accepted: field-worn handmade panel language. Center is parchment-filled, so live UI should place text over it rather than expecting a transparent hole.

- `item-slot-backing-v1.png`
  - Source: PixelLab map object `ce76bb2d-6eab-4f15-8703-61123d56aff8`.
  - Use: item backing inside satchel or crafting grids.
  - Reason accepted: quiet enough to sit behind item icons.

- `recipe-card-v1.png`
  - Source: PixelLab map object `007bbc56-8a08-4b43-b7c3-1dd378fb009b`.
  - Use: crafting recipe card background.
  - Reason accepted: rough bark/cloth language supports crafting without looking like a generic menu.

- `badge-handcraft-v1.png`
  - Source: PixelLab map object `dcbfea40-cd9c-4afd-aa78-6da6e66cf505`.
  - Use: handcraft recipe context badge.
  - Reason accepted: reads as handmade/twine action at small size.

- `badge-binding-v1.png`
  - Source: PixelLab map object `98fcfd1f-315d-41ac-996b-a880506a30ab`.
  - Use: Basic Workbench binding-context badge, not a separate binding station badge.
  - Reason accepted: strong twine/binding read.
  - Rule: show binding as a workbench capability or recipe context, not as its own early station.

- `badge-stone-working-v1.png`
  - Source: PixelLab map object `02a8efe6-9a30-42c5-8a89-27670f4b87ae`.
  - Use: stone-working station requirement badge.
  - Reason accepted: flat stone surface read without becoming a full object.

- `badge-blade-seed-v1.png`
  - Source: PixelLab map object `52f917ab-bc52-4a82-97ed-625c25eb1c34`.
  - Use: blade seed affinity badge.
  - Reason accepted: symbolic token, not a finished sword.

## Rejected Or Review-Only Candidates

Stored under `source/pixellab-2026-05-20-ui-*`.

- First selected hotbar slot filled the center, so it is review-only.
- Generated blade and axe badges that showed finished weapons are review-only.
- Axe seed badge is not accepted yet. PixelLab kept producing literal axe/handle shapes, which is too advanced for the current "seed" concept.

## Current Rule

Use generated UI art as modular skin pieces only. Layout, text, item counts, selected states, missing-material states, and responsive behavior stay in code/CSS.
