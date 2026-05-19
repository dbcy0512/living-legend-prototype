# Environment Art Plan

## Goal

Start the art pipeline with the world, not the character.

The first environment pass should improve the prototype's look and feel while protecting gameplay readability. These assets should support a classic top-down Zelda-like screen, a cel-shaded anime fantasy tone, and survival mechanics built around gathering, night pressure, and campfire safety.

Current strict direction:

Use `ENVIRONMENT_ASSET_KIT_V1.md` as the active asset brief. The target is reference-like top-down RPG readability translated into a colder, cleaner, anime-inspired cel-shaded survival world. Do not generate generic item icons or abstract placeholder shapes.

The first approved batch should be:

- dead fire pit
- leaf bed
- twig bundle
- dry grass clump
- bark strip
- striking stone
- tree cluster

## First Environment Pack

Create one small, coherent environment pack before expanding biomes.

Required assets:

- Grass base tile.
- Dirt clearing tile.
- Grass-to-dirt transition edges.
- Tall grass clump.
- Tree cluster.
- Flower/herb node.
- Stone node.
- Branch/wood node.
- Wild fruit node.
- Campfire unlit.
- Campfire lit.
- Small ember/firefly FX dots.

Optional after approval:

- Mossy stone.
- Small stump.
- Soft shadow blob.
- Campfire safety ring.
- Dawn/dusk light patch.

## Technical Requirements

Use transparent PNGs unless the asset is a full base tile.

Suggested sizes:

- Base tiles: `64x64`.
- Transition tiles: `64x64`.
- Tall grass/resource nodes: `32x32`.
- Tree cluster: `96x96` or `128x128`.
- Campfire: `32x32` or `48x48`.
- FX dots: `16x16`.

Camera and angle:

- Top-down three-quarter RPG view.
- Similar readability to classic Zelda-like games.
- No side-view platformer assets.
- No isometric diamond-grid perspective.

Pixel rules:

- Crisp pixel clusters.
- Clean cel-shaded highlight edges.
- No painterly blur.
- No heavy texture noise.
- No tiny detail that disappears at game scale.

Palette:

- Verdant greens.
- Warm gold sunlight.
- Deep ink-blue shadow.
- Small cyan or pale gold magic accents.
- Coral only for danger or important contrast.

Avoid:

- Brown/orange-heavy survival palette.
- Muddy realism.
- Beige parchment fantasy.
- Overly dark grim palette.
- Purple-dominant magical grass.
- Noisy tile repetition.

## Runtime Fit

The current prototype draws a large `960x540` play screen.

The environment assets need to support:

- readable player movement space
- gatherable nodes that stand out from decorative foliage
- campfire safety glow
- day/dusk/night tint shifts
- resource pulse animation
- later collision boundaries

Important distinction:

- Decorative grass can blend into the world.
- Gatherable resources must be readable immediately.
- Collision objects must have strong silhouettes.

## Pixel Lab Prompt 1: Environment Style Sheet

Use this first. Do not ask for a full tilemap yet.

```text
Create a pixel-art environment style sheet for a top-down three-quarter Zelda-like survival action RPG.

Style: cel-shaded anime fantasy, vibrant and readable, crisp pixel clusters, clean highlight edges, illustrated world feel.

Camera: classic top-down RPG view, not side-view, not isometric.

Theme: living enchanted wilderness clearing, epic fantasy survival, warm daylight with hints of dusk magic.

Palette: verdant greens, warm gold sunlight, deep ink-blue shadows, small pale cyan and pale gold magical accents. Avoid muddy realism, beige parchment tones, brown/orange-heavy survival colors, and purple-dominant grass.

Include separate assets on a transparent background:
1. grass base tile, 64x64
2. dirt clearing tile, 64x64
3. grass-to-dirt transition edge samples, 64x64 each
4. tall grass clump, 32x32
5. tree cluster, 96x96
6. flower/herb gather node, 32x32
7. stone gather node, 32x32
8. branch/wood gather node, 32x32
9. wild fruit gather node, 32x32
10. unlit campfire, 32x32
11. lit campfire, 32x32
12. small ember/firefly FX dots, 16x16

Requirements:
- transparent background for individual objects
- no labels or text
- no scenery poster composition
- no character
- no UI
- keep each asset separated with clean spacing
- strong readable silhouettes
- gatherable nodes must stand out from decorative grass
- collision objects like trees and stones need clear boundaries
```

## Pixel Lab Prompt 2: Grass And Clearing Tile Pass

Use this if the style sheet looks good and we want only terrain tiles next.

```text
Create a small pixel-art terrain tile set for a top-down three-quarter Zelda-like survival action RPG.

Style: cel-shaded anime fantasy, clean crisp pixel clusters, vibrant enchanted wilderness.

Canvas: transparent background where possible, tiles arranged in a clean grid with no labels.

Tiles:
- grass base 64x64
- grass variant 64x64
- dirt clearing base 64x64
- dirt variant 64x64
- grass-to-dirt north edge 64x64
- grass-to-dirt south edge 64x64
- grass-to-dirt east edge 64x64
- grass-to-dirt west edge 64x64
- four corner transitions 64x64

Palette: verdant greens, warm gold dirt, deep ink-blue shadow accents, clean pale highlight edges.

Avoid noisy repeating texture. Each tile should be readable at game scale and suitable for a classic top-down action RPG field.
```

## Pixel Lab Prompt 3: Gatherable Resource Nodes

Use this after terrain direction is approved.

```text
Create pixel-art gatherable resource nodes for a top-down three-quarter Zelda-like survival action RPG.

Style: cel-shaded anime fantasy, crisp pixel clusters, transparent background, readable at 32x32.

Create separate 32x32 assets:
- flower/herb node with pale gold and soft green accents
- stone node with cool gray-blue cel shading
- branch/wood node with warm natural brown but not muddy
- wild fruit node with bright readable fruit accents

Requirements:
- no background
- no labels
- no character
- each node must be visually distinct from decorative grass
- each node should read as interactive/gatherable at small size
- consistent lighting direction and palette
```

## Pixel Lab Prompt 4: Campfire Object

Use this once the terrain and resources are approved.

```text
Create pixel-art campfire assets for a top-down three-quarter Zelda-like survival action RPG.

Style: cel-shaded anime fantasy, crisp pixel clusters, transparent background, readable at 32x32 or 48x48.

Create:
- unlit campfire
- lit campfire frame 1
- lit campfire frame 2
- lit campfire frame 3
- warm ember dots
- soft circular glow suggestion as a separate transparent asset

Requirements:
- no background scenery
- no labels
- no character
- warm gold/orange flame with pale yellow core
- deep ink-blue shadow under the logs
- campfire must read clearly as a safety object
- lit frames must keep the logs stable while only the flame changes
```

## Acceptance Checklist

Before integrating any environment asset:

- Does it match top-down three-quarter perspective?
- Does it read clearly at the intended in-game size?
- Are gatherable nodes distinct from decorative foliage?
- Are collision objects visually obvious?
- Does the palette match the current cel-shaded anime wilderness target?
- Is the background transparent where needed?
- Are assets separated cleanly enough to crop?
- Does it avoid noisy texture and muddy survival-game browns?
- Can it work under dawn/dusk/night tinting?

## Integration Order

1. Save approved source sheets under `public/assets/environment/source/`.
2. Crop normalized runtime PNGs under `public/assets/environment/`.
3. Add stable keys to `src/game/assets/manifest.ts`.
4. Load assets in `BootScene`.
5. Replace generated grass/resource/campfire placeholders one group at a time.
6. Browser smoke test after each group.

Do not replace every placeholder at once.
