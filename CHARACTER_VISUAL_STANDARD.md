# Starter Child Character Visual Standard v1

## Purpose

This standard defines the first real player-character target before PixelLab or any sprite generator produces the shipped character art.

The character must support the core fantasy:

- a child waking into a world that did not wait for them to be ready
- condition first, heroism later
- readable survival pressure
- future gear, tools, carried objects, and earned combat smoothness

The rendered sprite is an output. The character contract is the source of truth.

## Art Direction

- Top-down 3/4 Zelda-like view.
- Cel-shaded anime-inspired shape language.
- Gritty survival tone, not bright mascot fantasy.
- Small body in a large world.
- Clear silhouette at game scale.
- No baked scenery, ground, shadow, glow, UI, labels, or background.
- Transparent background only.

## Scale

- Runtime frame size: `64 x 64`.
- Visual child height target: `36-44 px` inside the frame.
- Foot anchor: bottom-center, near `x=0.5`, `y=0.78`.
- The head and shoulders may lean or shiver, but the feet must remain stable against the anchor.
- Collision remains simulation-owned. Sprite art must not define collision.

## Required Visual Layers

Each final character asset pass must preserve these conceptual layers, even if they are flattened into one temporary sprite sheet for early runtime:

- body base
- head and hair
- worn clothing
- hands
- main-hand item attachment
- tool attachment
- back or carried-item attachment
- condition overlay space
- shadow, handled separately by runtime

## Required Equipment Sockets

These sockets must remain stable across animations:

- `mainHand`: branch club, stone edge, later weapons
- `tool`: gathering/crafting tools
- `body`: clothing and armor
- `back`: carried bundle, quiver, pack, or future survival gear
- `hands`: gather, kneel, craft, use-item poses

The current runtime already has `equipment.mainHand`, `equipment.tool`, and `equipment.body`. Future work should expand equipment state before adding visual-only gear hacks.

## Required Condition States

Condition must be visible before UI explains it:

- cold: shoulders raised, arms closer, slight inward posture
- warming: posture loosens, stance opens slightly
- exhausted: lower stance, slower pose, heavier shoulders
- hurt: guarded torso, smaller stance
- under threat: alert posture without becoming heroic

These condition states are driven by world/body state. They are not separate classes.

## Required Animation Groups

The first complete player sheet must plan for these groups:

- idle-cold
- idle-warm
- walk
- gather
- fire-kneel
- attack-bare
- attack-main-hand
- dodge-roll
- hurt
- collapse
- use-item

Each group should be authored for north, south, east, and west unless a temporary prototype pass explicitly marks it as one-direction-only.

## PixelLab Generation Prompt Base

Use this as the base direction when generating the first seed frame:

Create a top-down 3/4 cel-shaded anime survival RPG child character sprite, transparent background, 64x64 game frame, small vulnerable silhouette, cold cautious posture, worn simple cloth, no weapon, no scenery, no ground, no labels, no UI, crisp readable shape clusters, gritty fantasy palette, upper-left light source, bottom-center foot anchor, designed for future equipment sockets and smooth 2D animation.

## Acceptance Gates

A generated character seed is not accepted unless:

- it reads as a child, not a tiny adult hero
- cold/vulnerability is visible from pose alone
- the silhouette is clear at game scale
- the hands can believably gather, kneel, hold tools, and attack
- `mainHand`, `tool`, `body`, and `back` attachment zones remain plausible
- it has transparent background
- it has no baked ground or scenery
- it fits the `64 x 64` frame without cropping
- it can become a full strip without changing identity
