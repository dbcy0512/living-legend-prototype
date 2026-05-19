# Environment Asset Kit v1

## Purpose

Replace the current debug-looking generated environment with a small, strict asset kit for the starting area.

This is not a full art production pass. It is the bridge from placeholder geometry to a readable top-down anime survival RPG world.

## Reference Translation

Use the provided top-down RPG village reference as the readability anchor.

What to preserve from the reference:

- classic top-down three-quarter RPG camera
- readable object silhouettes
- chunky pixel clusters
- warm dark outlines
- organic grass and dirt edges
- clear prop grouping
- soft object shadows
- strong separation between ground, props, and boundaries

What to change for our game:

- more cel-shaded anime contrast
- colder dawn survival mood
- cleaner highlight blocks
- less cozy village warmth
- more fragile wilderness survival feeling
- no houses, fences, village props, or full scene backgrounds for this kit

Target feeling:

Cozy JRPG readability after the warmth is gone.

## Hard Art Rules

Every prop asset must be:

- top-down three-quarter RPG pixel art
- anime-inspired cel-shaded fantasy
- readable as a world object, not a UI icon
- transparent background
- clean dark contour or warm outline
- soft painted shadow under the object
- consistent lighting from upper-left
- crisp pixel clusters, no painterly blur
- no labels or text
- no character
- no full background scene
- no side-view object angle
- no isometric diamond-grid perspective

Ground tiles may have full square backgrounds. Props should not.

## Palette Direction

Use:

- fresh grass greens
- cool dawn blue-green shadows
- warm gold highlights only where useful
- muted straw yellows for dry grass
- cool blue-gray for striking stone
- warm brown for bark and branches
- pale cyan only as a very small accent, if needed

Avoid:

- muddy brown survival-game palette
- beige parchment fantasy
- purple-dominant grass
- noisy high-frequency texture
- realistic rendering
- flat icon colors

## Scale Targets

Runtime crop targets:

- grass base tile: `64x64`
- dirt or flattened clearing tile: `64x64`
- dead fire pit: `48x48`
- leaf bed: `64x48`
- twig bundle: `48x32`
- dry grass clump: `48x40`
- bark strip: `48x32`
- striking stone: `40x32`
- fallen branch: `64x40`
- tree cluster: `96x96` or `128x128`
- dark undergrowth: `64x48`
- trail stones: `48x32`

The asset can be generated larger, but it must crop cleanly down to these sizes.

## First Batch

Generate these first before making the full kit:

1. dead fire pit
2. leaf bed
3. twig bundle
4. dry grass clump
5. bark strip
6. striking stone
7. tree cluster

Reason:

These directly solve the current problem: the opening should read as a cold survival place with usable objects, not a debug map.

Copy-paste prompt packet:

Use `PIXELLAB_FIRST_BATCH_PROMPTS.md` for the exact Pixel Lab prompts, output filenames, approval order, and rejection rules.

## Prompt: Dead Fire Pit

```text
Create a single top-down three-quarter RPG pixel art world prop: a dead campfire pit.

Style: anime-inspired cel-shaded fantasy, similar readability to classic top-down RPG village pixel art, clean dark contour, crisp pixel clusters, transparent background.

Object: small ash ring with crossed half-burned sticks, gray ash, a few charcoal ends, soft painted shadow underneath. It should feel cold and recently failed, but still clearly rebuildable.

Mood: cold dawn survival, fragile, quiet, not cozy.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background, no side-view angle, no isometric perspective. Readable when cropped around 48x48 pixels.
```

## Prompt: Leaf Bed

```text
Create a single top-down three-quarter RPG pixel art world prop: an improvised leaf bed.

Style: anime-inspired cel-shaded fantasy, classic top-down RPG readability, clean dark contour, crisp pixel clusters, transparent background.

Object: flattened pile of leaves and damp grass, slightly uneven oval shape, a small torn cloth scrap partly tucked into it, soft painted shadow underneath. It should look like a child slept there because there was no better shelter.

Mood: cold dawn survival, fragile, not comfortable, not decorative.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background, no side-view angle, no isometric perspective. Readable when cropped around 64x48 pixels.
```

## Prompt: Twig Bundle

```text
Create a single top-down three-quarter RPG pixel art world prop: a small twig bundle lying in grass.

Style: anime-inspired cel-shaded fantasy, classic top-down RPG readability, clean dark contour, crisp pixel clusters, transparent background.

Object: three or four thin sticks crossing naturally, warm brown wood, pale cut tips, small soft shadow. It must read as a gatherable world object, not an inventory icon.

Mood: useful primitive material in a cold wilderness clearing.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background, no side-view angle, no isometric perspective. Readable when cropped around 48x32 pixels.
```

## Prompt: Dry Grass Clump

```text
Create a single top-down three-quarter RPG pixel art world prop: a dry grass clump for kindling.

Style: anime-inspired cel-shaded fantasy, classic top-down RPG readability, clean dark contour, crisp pixel clusters, transparent background.

Object: pale straw-yellow grass tuft, taller and drier than normal green grass, several distinct blades with cel-shaded highlights, small ground shadow. It must read as useful kindling, not decorative grass.

Mood: cold dawn survival, primitive fire material.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background, no side-view angle, no isometric perspective. Readable when cropped around 48x40 pixels.
```

## Prompt: Bark Strip

```text
Create a single top-down three-quarter RPG pixel art world prop: a curved bark strip.

Style: anime-inspired cel-shaded fantasy, classic top-down RPG readability, clean dark contour, crisp pixel clusters, transparent background.

Object: curved brown bark shard with warm orange-brown cel highlights, rough outer bark, lighter inner edge, soft painted shadow. It must read as a gatherable fire-making material, not a random brown blob.

Mood: useful primitive material in a cold wilderness clearing.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background, no side-view angle, no isometric perspective. Readable when cropped around 48x32 pixels.
```

## Prompt: Striking Stone

```text
Create a single top-down three-quarter RPG pixel art world prop: a chipped striking stone.

Style: anime-inspired cel-shaded fantasy, classic top-down RPG readability, clean dark contour, crisp pixel clusters, transparent background.

Object: blue-gray chipped stone with one bright pale edge highlight, faceted cel shading, small cool shadow. It must look different from a generic rock and suggest it can make sparks.

Mood: useful primitive fire-starting material, cold dawn survival.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background, no side-view angle, no isometric perspective. Readable when cropped around 40x32 pixels.
```

## Prompt: Tree Cluster

```text
Create a single top-down three-quarter RPG pixel art world prop: a leafy tree cluster for a wilderness boundary.

Style: anime-inspired cel-shaded fantasy, similar readability to classic top-down RPG village pixel art, clean dark contour, crisp pixel clusters, transparent background.

Object: layered green canopy cluster with a small trunk hint visible near the bottom, rounded foliage masses, strong cel-shaded highlights from upper-left, cool blue-green shadow pockets, soft painted shadow underneath. It should read as a boundary object in a top-down action RPG.

Mood: living wilderness, slightly cold dawn, not dark grim fantasy.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background, no side-view angle, no isometric perspective. Readable when cropped around 96x96 or 128x128 pixels.
```

## Second Batch

Generate only after the first batch looks correct:

- grass base tile
- flattened dirt clearing tile
- dark undergrowth patch
- fallen branch
- trail stones
- herb node
- generic loose stone
- wood/branch node
- wild fruit node
- lit campfire frames

## Prompt: Grass Base Tile

```text
Create a seamless 64x64 grass base tile for a top-down three-quarter anime fantasy RPG.

Style: cel-shaded pixel art, classic top-down RPG readability, crisp pixel clusters, organic grass variation, clean upper-left highlights, cool dawn blue-green shadows.

The tile should feel like illustrated ground, not noisy texture. It must support repeated tiling under moving characters.

Technical: 64x64 tile, no labels, no objects, no flowers, no character, no UI, no full scene composition, not isometric, not side-view.
```

## Prompt: Flattened Clearing Tile

```text
Create a seamless 64x64 flattened dirt and trampled grass tile for a top-down three-quarter anime fantasy RPG.

Style: cel-shaded pixel art, classic top-down RPG readability, crisp pixel clusters, organic edges, cold dawn mood.

The tile should read as a small survival wake site: damp earth, flattened grass, subtle leaf fragments, not a road, not a village path.

Technical: 64x64 tile, no labels, no objects, no character, no UI, no full scene composition, not isometric, not side-view.
```

## Prompt: Dark Undergrowth

```text
Create a single top-down three-quarter RPG pixel art world prop: a dark undergrowth patch.

Style: anime-inspired cel-shaded fantasy, classic top-down RPG readability, clean dark contour, crisp pixel clusters, transparent background.

Object: dense low foliage and shadowy grass, cool blue-green shadows, readable silhouette, a few sharp grass shapes. It should suggest a dangerous wild edge without looking magical or purple.

Technical: transparent background, no labels, no character, no UI, no full scene background, no side-view angle, no isometric perspective. Readable when cropped around 64x48 pixels.
```

## Acceptance Checklist

Approve an asset only if all are true:

- It matches the top-down three-quarter RPG camera.
- It feels close to the reference's readability, but more cel-shaded/anime.
- It is a world prop, not an icon.
- It has transparent background if it is a prop.
- It has a clear silhouette at runtime scale.
- It has a soft object shadow or grounding shape.
- It uses controlled color, not muddy survival browns.
- It avoids noisy pixel texture.
- It remains readable under cold blue dawn tint.
- It can be cropped without cutting off important pixels.

Reject an asset if:

- it looks like a side-view object
- it looks like an inventory icon
- it includes labels or text
- it is a full background scene
- it is too realistic
- it is too abstract to name quickly
- it clashes with the reference angle

## Import Boundary

When these assets are approved, implementation must be limited to:

1. Save source sheets in `public/assets/environment/source/`.
2. Crop runtime PNGs into `public/assets/environment/`.
3. Add or update stable keys in `src/game/assets/manifest.ts`.
4. Load approved PNGs in `src/phaser/scenes/BootScene.ts`.
5. Replace generated placeholders one asset group at a time.
6. Run `npm.cmd test`.
7. Run `npm.cmd run build`.
8. Browser smoke test the starting area.

No combat changes. No survival rule changes. No enemy behavior changes. No map expansion during this import pass.
