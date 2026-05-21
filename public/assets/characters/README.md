# Character Asset Intake

PixelLab generation date: 2026-05-21.

## Current Review Candidate

- `source/pixellab-2026-05-21-starter-child-cold-v3-state/`
  - PixelLab character id: `21e5e1bc-deaf-4a23-9556-fb093a240444`.
  - Source state of: `aba028d2-7a81-4553-b952-1b570d22325c`.
  - Use: review candidate for the starter child's cold idle seed.
  - Files: 8 directional rotations plus `rotation-contact-sheet.png`.
  - Reason kept: strongest cold-condition read so far; arms tuck inward, stance is smaller, and the child still has clear hand/held-item zones.
  - Runtime status: normalized into `starter-child-cold-v3-*.png` and wired into gameplay as the first starter child model.
  - Normalization: 68 x 68 source lifted into a 64 x 64 runtime frame with the feet aligned to `starter-child-character-standard-v1`.

## Reference / Rejected First Passes

- `source/pixellab-2026-05-21-starter-child-cold-v1/`
  - PixelLab character id: `142debc4-c11e-49e8-8dfb-974b9c726438`.
  - Reason not accepted: readable child, but the pose is too neutral for the opening cold condition.

- `source/pixellab-2026-05-21-starter-child-cold-v2/`
  - PixelLab character id: `aba028d2-7a81-4553-b952-1b570d22325c`.
  - Reason not accepted: cleaner anime child identity than v1, but still not enough cold/vulnerability in the posture.

## Current Rule

Do not wire character source rotations directly into runtime. First approve the visual direction, then normalize to the `starter-child-character-standard-v1` frame contract and only then add manifest/runtime animation keys.
