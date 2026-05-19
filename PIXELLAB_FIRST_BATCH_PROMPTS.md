# Pixel Lab First Batch Prompts

## Use This First

Generate these one asset at a time. Do not generate a full mixed sheet until the style is proven on the first two or three assets.

Reference target:

- classic top-down RPG village readability
- anime-inspired cel-shaded fantasy
- cold dawn survival mood
- clean silhouettes
- warm dark outlines
- soft grounding shadows
- world props, not inventory icons

Reject anything that looks like:

- a UI icon
- a side-view object
- a full background scene
- generic placeholder art
- noisy retro texture
- muddy brown survival art
- an object with the wrong camera angle

## Output Naming

Save approved exports here first:

`public/assets/environment/source/pixellab-first-batch/`

Use these filenames:

- `dead-fire-pit-source.png`
- `leaf-bed-source.png`
- `twig-bundle-source.png`
- `dry-grass-clump-source.png`
- `bark-strip-source.png`
- `striking-stone-source.png`
- `tree-cluster-source.png`

Runtime cropped files will later go here:

`public/assets/environment/`

Runtime target names:

- `dead-fire-pit-v1.png`
- `leaf-bed-v1.png`
- `twig-bundle-v1.png`
- `dry-grass-clump-v1.png`
- `bark-strip-v1.png`
- `striking-stone-v1.png`
- `tree-cluster-v1.png`

## Shared Negative Prompt

Use this negative prompt with every asset if Pixel Lab supports negatives:

```text
no UI icon, no inventory icon, no label, no text, no character, no full background scene, no side-view perspective, no isometric diamond-grid angle, no realistic rendering, no muddy brown palette, no noisy texture, no blurry painterly edges, no flat abstract symbol, no poster composition, no building, no fence, no village structure
```

## 1. Dead Fire Pit

```text
Create a single top-down three-quarter RPG pixel art world prop: a dead campfire pit.

Style: anime-inspired cel-shaded fantasy, similar readability to classic top-down RPG village pixel art, clean warm dark outline, crisp pixel clusters, transparent background.

Object: small ash ring with crossed half-burned sticks, gray ash, a few charcoal ends, soft painted shadow underneath. It should feel cold and recently failed, but still clearly rebuildable.

Mood: cold dawn survival, fragile, quiet, not cozy.

Camera: classic top-down three-quarter action RPG view, not side-view, not isometric.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background. Keep generous padding. Readable when cropped around 48x48 pixels.
```

## 2. Leaf Bed

```text
Create a single top-down three-quarter RPG pixel art world prop: an improvised leaf bed.

Style: anime-inspired cel-shaded fantasy, similar readability to classic top-down RPG village pixel art, clean warm dark outline, crisp pixel clusters, transparent background.

Object: flattened pile of leaves and damp grass, slightly uneven oval shape, a small torn cloth scrap partly tucked into it, soft painted shadow underneath. It should look like a child slept there because there was no better shelter.

Mood: cold dawn survival, fragile, not comfortable, not decorative.

Camera: classic top-down three-quarter action RPG view, not side-view, not isometric.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background. Keep generous padding. Readable when cropped around 64x48 pixels.
```

## 3. Twig Bundle

```text
Create a single top-down three-quarter RPG pixel art world prop: a small twig bundle lying naturally on grass.

Style: anime-inspired cel-shaded fantasy, similar readability to classic top-down RPG village pixel art, clean warm dark outline, crisp pixel clusters, transparent background.

Object: three or four thin sticks crossing naturally, warm brown wood, pale cut tips, tiny bits of grass around the base, small soft shadow. It must read as a gatherable world object, not an inventory icon.

Mood: useful primitive material in a cold wilderness clearing.

Camera: classic top-down three-quarter action RPG view, not side-view, not isometric.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background. Keep generous padding. Readable when cropped around 48x32 pixels.
```

## 4. Dry Grass Clump

```text
Create a single top-down three-quarter RPG pixel art world prop: a dry grass clump for kindling.

Style: anime-inspired cel-shaded fantasy, similar readability to classic top-down RPG village pixel art, clean warm dark outline, crisp pixel clusters, transparent background.

Object: pale straw-yellow grass tuft, taller and drier than normal green grass, several distinct blades with cel-shaded highlights, small ground shadow. It must read as useful kindling, not decorative grass.

Mood: cold dawn survival, primitive fire material.

Camera: classic top-down three-quarter action RPG view, not side-view, not isometric.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background. Keep generous padding. Readable when cropped around 48x40 pixels.
```

## 5. Bark Strip

```text
Create a single top-down three-quarter RPG pixel art world prop: a curved bark strip lying on grass.

Style: anime-inspired cel-shaded fantasy, similar readability to classic top-down RPG village pixel art, clean warm dark outline, crisp pixel clusters, transparent background.

Object: curved brown bark shard with warm orange-brown cel highlights, rough outer bark, lighter inner edge, small soft painted shadow. It must read as a gatherable fire-making material, not a random brown blob.

Mood: useful primitive material in a cold wilderness clearing.

Camera: classic top-down three-quarter action RPG view, not side-view, not isometric.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background. Keep generous padding. Readable when cropped around 48x32 pixels.
```

## 6. Striking Stone

```text
Create a single top-down three-quarter RPG pixel art world prop: a chipped striking stone lying in grass.

Style: anime-inspired cel-shaded fantasy, similar readability to classic top-down RPG village pixel art, clean warm dark outline, crisp pixel clusters, transparent background.

Object: blue-gray chipped stone with one bright pale edge highlight, faceted cel shading, small cool shadow. It must look different from a generic rock and suggest it can make sparks.

Mood: useful primitive fire-starting material, cold dawn survival.

Camera: classic top-down three-quarter action RPG view, not side-view, not isometric.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background. Keep generous padding. Readable when cropped around 40x32 pixels.
```

## 7. Tree Cluster

```text
Create a single top-down three-quarter RPG pixel art world prop: a leafy tree cluster for a wilderness boundary.

Style: anime-inspired cel-shaded fantasy, similar readability to classic top-down RPG village pixel art, clean warm dark outline, crisp pixel clusters, transparent background.

Object: layered green canopy cluster with a small trunk hint visible near the bottom, rounded foliage masses, strong cel-shaded highlights from upper-left, cool blue-green shadow pockets, soft painted shadow underneath. It should read as a boundary object in a top-down action RPG.

Mood: living wilderness, slightly cold dawn, not dark grim fantasy.

Camera: classic top-down three-quarter action RPG view, not side-view, not isometric.

Technical: transparent background, no labels, no UI icon style, no character, no full scene background. Keep generous padding. Readable when cropped around 96x96 or 128x128 pixels.
```

## Approval Order

Approve in this order:

1. Dead fire pit
2. Leaf bed
3. Tree cluster
4. Twig bundle
5. Dry grass clump
6. Bark strip
7. Striking stone

Reason:

The first three prove the world style. The last four prove material readability.

## Import Rule

Do not import assets just because they exist.

Only import an asset after it passes:

- camera angle is correct
- silhouette is readable
- it feels like the reference translated into cel-shaded anime fantasy
- it reads as a world prop
- it still makes sense at runtime size
