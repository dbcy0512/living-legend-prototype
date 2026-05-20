# Crafting Asset Intake

PixelLab generation date: 2026-05-20.

## Accepted Runtime Candidates

- `simple-poultice-v1.png`
  - Source: PixelLab map object `a9383e4e-cc82-4570-93ae-94cff42efd95`.
  - Use: hotbar/inventory icon for Simple Poultice.
  - Reason accepted: reads as a wrapped wound bundle rather than a plant node.

- `twine-coil-v1.png`
  - Source: PixelLab map object `15e254c6-65ab-441e-86d5-56125265ecec`.
  - Use: hotbar/inventory icon for early binding/twine material.
  - Reason accepted: clear small silhouette, no baked ground.

- `branch-club-v1.png`
  - Source: PixelLab map object `c7ef42ed-45fd-4b26-97a8-bc6df5a90ace`.
  - Use: hotbar/inventory icon for the branch-club melee seed.
  - Reason accepted: crude branch weapon silhouette, child-made tone.

- `stone-edge-v1.png`
  - Source: PixelLab map object `10fffea0-0693-4e16-8394-bad47c70f533`.
  - Use: hotbar/inventory icon for the stone-edge melee seed.
  - Reason accepted: axe-line read is acceptable because Stone Edge is intended to seed axe evolution.

- `binding-spot-v1.png`
  - Source: PixelLab map object `30ccdca9-c44d-4ca7-9a97-1d25b0eb2e63`.
  - Use: first crafted station candidate for binding/twine/poultice-adjacent recipes.
  - Reason accepted: loose objects, transparent background, no baked dirt/grass island.

- `stone-working-place-v1.png`
  - Source: PixelLab map object `b807a3f7-868a-41ce-8241-27951b80e61f`.
  - Use: first stone-working station candidate.
  - Reason accepted: simple flat stone surface fits Zone 1 better than a built table.

## Rejected Or Review-Only First Pass

Stored under `source/pixellab-2026-05-20-first-pass`.

- First poultice read as a potted plant, not a crafted survival item.
- First binding and stone-working stations included baked ground/island treatment.
- First stone edge read as a more finished hatchet; kept only as review context.

## Current Rule

Do not wire these into gameplay until the related hotbar, inventory, and station-crafting behavior is designed. Assets should support system readability, not force mechanics too early.
