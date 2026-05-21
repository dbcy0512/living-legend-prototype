# Living Legend Prototype Plan

## Core Intent

Build a top-down, Zelda-like survival action RPG prototype with an epic fantasy tone and a living cel-shaded anime-inspired world.

The project should become a system we can grow, not a one-off demo. The first playable version must prove world feel, survival pressure, inventory/crafting, and a smooth combat foundation without locking us into final lore, final art, or final combat innovation too early.

## Design Pillars

1. World first
   - The world should feel alive before the combat becomes deep.
   - Wind, light, mood, ambient motion, resource behavior, day-night pressure, and creature reactions should make the scene feel like it is breathing.

2. Smooth scalable combat second
   - Combat starts simple but must be built as phases, timings, hit windows, stamina costs, recovery, and animation states.
   - The first system should support later innovation without rewriting the player from scratch.

3. Survival has our own meaning
   - Survival is not only hunger meters and crafting chores.
   - Survival means existing inside a world that reacts, remembers pressure, changes its emotional tone, and makes the player prepare before danger.

4. Pixel Lab accelerates assets, not architecture
   - Pixel Lab should produce player, enemy, terrain, and FX assets.
   - Gameplay rules must not depend on asset filenames or one-off art quirks.

5. Controlled steps
   - Each new mechanic should be small, testable, and reversible.
   - Systems that commonly break need tests before or during expansion.

6. The fire anchors exploration
   - The fire should never become a prison.
   - Early play may revolve around the main fire, but advancement should open the ability to explore farther.
   - The long-term fantasy is not being tethered to one spot; it is pushing the boundary of light outward.

## Current Prototype Baseline

Already implemented:

- Phaser + TypeScript + Vite.
- Simulation state separated from Phaser rendering.
- Top-down playable field.
- Player movement.
- Stamina.
- Dodge roll with stamina cost and brief invulnerability.
- Attack phases: windup, active, recovery.
- Enemy watching, stalking, and striking states.
- Hunger drain.
- World time, day count, wind phase, life pulse, and mood.
- Gatherable resources.
- Opening kindling resources: twigs, dry grass, bark, and a striking stone.
- A dead first fire near the player start.
- Cold as an opening world pressure.
- First fire rebuild recipe.
- Campfire crafting cost.
- DOM HUD.
- Tests for combat phase timing, dodge stamina/invulnerability, crafting costs, and world pressure.

The current art is generated placeholder geometry. It is not final art, but it establishes the visual target: top-down, readable, cel-shaded, anime-inspired, colorful, and alive.

## First Vertical Slice

Target: a 5-minute playable survival action loop.

The player should be able to:

- Explore a compact top-down overworld screen.
- Gather wood, stone, herbs, and food.
- Manage stamina and hunger.
- Craft a campfire.
- Fight or avoid one to three enemies.
- Survive a day-night pressure shift.
- Feel the world change through color, motion, enemy behavior, and ambient FX.

Success condition:

- Player can survive until dawn or stabilize at camp.

Failure condition:

- Player health reaches zero from starvation, enemy attacks, or night pressure.

## World Design

### Camera

Classic top-down Zelda-like view.

Initial route:

- One large screen with room-like composition.
- No scrolling camera yet.
- The screen should be authored like a readable game board: safe area, resource pockets, creature lane, and danger edge.

Later route:

- Screen-to-screen transitions.
- Region tiles.
- Procedural room stitching.
- Biome-specific living rules.

### Living World Systems

Current systems to grow:

- `timeOfDay`
- `day`
- `mood`
- `windPhase`
- `lifePulse`

Planned world systems:

- Ambient wind affects foliage, grass, cloth, particles, water, and light.
- World mood changes color grading and enemy aggression.
- Dawn, day, dusk, and night each change behavior.
- Resource nodes pulse, regrow, wither, or become dangerous based on mood.
- Campfires push back night mood in a radius.
- Some enemies become calmer near light and more aggressive in darkness.

Important rule:

World mood should be a real simulation value, not only a shader or visual filter.

## Survival Design

Initial survival mechanics:

- The opening starts with cold before hunger becomes the main survival pressure.
- The first fire is rebuilt from primitive nearby materials.
- Hunger drains over time.
- Hunger affects stamina recovery.
- Zero hunger damages health.
- Campfire is the first crafted stabilizer.

Next survival mechanics:

- Food restores hunger.
- Herbs restore health or create healing items.
- Campfire produces a safety radius.
- Night increases hunger drain and enemy aggression.
- Weather or corruption modifies world mood.

Avoid early:

- Large crafting trees.
- Complex equipment durability.
- Base-building UI.
- Dozens of item types.

Survival should create pressure and preparation, not busywork.

### First Breath Opening

Current implementation target:

- The player begins cold beside a dead first fire.
- The nearby world has primitive pieces: twigs, dry grass, bark, and a striking stone.
- `E` gathers what is close enough to touch.
- Gatherable materials show a soft proximity ring and give a short pop/fade response when collected.
- `C` rebuilds the first fire only when the opening materials are ready and the player is near the dead fire.
- The first flame lowers cold and transitions the game into the open survival loop.
- Enemies stay dormant until the opening resolves, so the first lesson is usefulness, not combat.
- The opening prompt starts broad: "The fire is dead. It could burn again."
- Missing materials are shown only after the player tries to rebuild too early.
- Once all materials are held, the prompt shifts to the fire being ready.
- After lighting, the prompt becomes "The spark catches. Stay close."
- Cold pressure is also visual: cool screen tone, slight shiver, breath/wisp effects, and a smaller colder player aura until warmth returns.
- Cold pressure is mechanical: high exposure slows stamina recovery and eventually chips health if ignored.

Design reason:

The opening should teach that the world has pieces and the player has hands. This is the foundation for later behavior recipes, crafting, exploration, and identity without presenting a tutorial screen or class choice.

Readability rule:

Danger teaches why the fire matters. The prompt teaches that the fire can be answered. The game should not reveal a checklist until the player has tried to act.

### Beginning Sandbox v1

Current implementation target:

- Wake site contains the first fire and a leaf-bed sleeping spot.
- Sandbox world size is now `1500 x 850`, giving the camera more room while staying hand-authored.
- The sleeping spot is the current respawn point.
- Collapse no longer ends the run immediately; the player returns to the sleeping spot with partial health, stamina, hunger floor, lowered cold, and brief invulnerability.
- Opening materials are authored into a clear gather ring around the wake site.
- Normal resources sit farther out so leaving the fire has a reason after the opening.
- The wolf starts farther out in the darker wild edge instead of the center field.
- Wolf territory pressure thresholds are shifted outward to match the larger area.
- The terrain includes rough prototype zone cues: fire/wake center, darker wild edge, and a first outward path.
- A first outward path cue exists along the lower-right edge for later exploration expansion.
- World Readability Art Pass v2 removes the burned path for now and shifts the scene away from debug markers toward readable survival props: larger opening materials, stronger dead fire and leaf bed, torn cloth around the wake site, fallen branches, trail stones on the outward route, and darker marks in wolf territory.
- Environment Asset Import v1 brings the first approved cel-shaded anime world props into runtime: dead fire pit, leaf bed, and tree cluster. These replace generated placeholders for the wake anchor, respawn spot, and forest boundary while leaving gameplay rules unchanged.
- Ground Tile Import v1 replaces the old grass and clearing placeholder textures with cel-shaded anime terrain crops and adds a dark undergrowth patch to the wolf edge. Zone overlays were reduced so the new terrain art can carry more of the scene.
- Placeholder Cleanup v1 removes the old generated decorative grass/flower scatter layer because it reads as debug art against the imported terrain. Small foliage detail should now come from authored terrain/resource assets, not generic triangle sprites.
- Environment Placement Fix v1 moves the leaf-bed respawn point farther left from the first fire and removes rectangular dark-undergrowth placements until that asset can be reshaped into an organic patch.
- Asset Stability Fix v1 removes automatic sway/pulse motion from static environment props and resource nodes. Movement is reserved for intentional gameplay feedback such as player shiver, fire, particles, and combat/readability FX.
- Lit Fire Asset Import v1 replaces the first fire's generated lit placeholder with an imported cel-shaded lit fire pit that matches the dead fire's stone-ring/log identity.
- Asset Opacity Fix v1 keeps visible resource nodes and fire-state assets at full alpha. Assets should not appear ghosted unless they are intentionally depleted, hidden, or part of an FX overlay.
- Fire State Clarity v1 uses hard visibility switching between unlit and lit fire assets, removes the extra shadow layer from the imported first fire, stops scaling the full lit asset, and introduces a reusable flame-only FX overlay for active campfires.
- Environment Layering Fix v1 moves ground props, resources, campfires, and tree art into a low environment depth band while actors render above them. This prevents the player from clipping behind assets that sit on the ground. It also removes the remaining generated brown debris/scuff props from the authored scene.
- Tree Variety Import v1 crops an alternate Pixel Lab tree cluster from the existing environment style sheet and mixes it with the current tree asset for less repetition while staying in the same visual language.
- External Pixel Lab Foliage Import v1 normalizes user-provided Pixel Lab foliage assets from `C:/Users/cyre0/OneDrive/Pictures`: a round bush, grass clump, and small tree. These assets are kept in the runtime asset library for future placement, but removed from the current map after placement review.
- Placeholder Detail Cleanup v1 removes the remaining generated story-detail placements around the wake site and trail. The current scene should rely on approved environment assets instead of generated cloth, stone, branch, or ash placeholders.
- Tree Collision v1 adds authored circular collision zones for current tree placements, resolves player movement against those zones in the simulation layer, and tests both blocked movement and diagonal sliding. Collision belongs to map data and simulation rules, not Phaser image bounds.
- Prototype Ring Cleanup v1 removes constant aura/placement/camp radius rings and disables placeholder player shiver. Readability should come from assets, prompts, fire state, and intentional interaction/combat FX rather than permanent debug circles.
- Border Placeholder Cleanup v1 removes the old long top/bottom map bars and corner blobs from the scene.
- Collision Debug Toggle v1 adds a hidden `K` key toggle that draws authored collision circles and the player collision radius only when needed for tuning.
- Opening Material Asset Import v1 replaces generated placeholder kindling assets with imported cel-shaded world props for twigs, dry grass, bark, and striking stone while keeping current prototype material positions.

Design reason:

The beginning area should hold the systems before it becomes pretty. The player needs a place to wake, a place to return, a reason to step outward, and a border where the world begins pushing back.

### Exploration Progression

The beginning surrounds the main fire.

At first, the player survives by learning the immediate area around the flame:

- gather nearby resources
- understand enemy pressure
- tend the fire
- craft simple stabilizers
- learn when it is safe to leave and when to return

Exploration opens through advancement, not through removing the fire's importance.

The intended progression:

1. Main fire
   - The first stable point.
   - Enables basic crafting, safety, recovery, and preparation.

2. Banked fire
   - The player can prepare the main fire before leaving.
   - Better preparation allows longer trips without constant return pressure.

3. Carried ember
   - A small portable extension of the main fire.
   - Allows short expeditions into riskier areas.
   - Weak safety, limited duration, vulnerable to danger.

4. Wayfires
   - Temporary footholds in the wilderness.
   - Useful for return routes, emergency safety, and small crafting moments.
   - Weaker than the main fire.

5. Light network
   - Later progression may allow linked fires, wards, beacons, shrines, lanterns, or fire-tech.
   - The player expands the livable world by building relationships with places.

Design commandment:

The fire anchors exploration; it must never prevent it.

Failure mode to avoid:

- fire drains too fast
- constant forced returns
- exploration punished immediately
- the player feels babysat by a meter

Correct feeling:

- the player prepares
- leaves with intent
- reads world signals
- risks going farther
- returns because the fire matters
- eventually earns ways to push deeper into the living world

### Behavior Recipes

Repeated behavior should become identity.

The game should track patterns quietly and let the world respond through changed behavior, not only through menus or explicit rewards.

Potential hidden behavior recipes:

- tending fire repeatedly -> Keeper pattern
- defending near the light -> Warden pattern
- gathering far from fire -> Forager pattern
- leaving fire low too often -> unstable camp pattern
- overharvesting nearby resources -> withered ground pattern
- using strange fuel repeatedly -> altered flame pattern
- returning to the same route repeatedly -> familiar path pattern

These recipes should be:

- legible after the fact
- surprising but not random
- expressed through world behavior, resource changes, enemy behavior, flame behavior, and subtle visual signals
- useful in solo play and expandable to co-op later if that ever returns

Important rule:

Do not reduce behavior recipes into generic class selection too early. Identity should first emerge from what the player repeatedly does.

## Combat Design

### Current Combat Foundation

Combat state lives in simulation:

- `idle`
- `windup`
- `active`
- `recovery`
- `rolling`

This is the correct foundation because smooth action combat needs readable timings.

### Combat Feel Target

The combat should feel:

- Smooth.
- Responsive.
- Readable.
- Slightly committed.
- Expandable.
- Animation-driven without making animation the source of truth.

### First Combat Expansion

Add:

- Directional attack arcs based on facing.
- Enemy knockback.
- Player hit-stop on successful hit.
- Enemy telegraph before striking.
- Roll cancel rules that are explicit, not accidental.
- Attack buffer window.

Innovation space later:

- Stance or spirit-state combat.
- Environmental reactions.
- Weapon identity.
- Charged attacks.
- Perfect dodge.
- World mood affecting combat behavior.
- Enemies responding to campfire, hunger, light, or player exhaustion.

Important rule:

Animations should follow combat state. Combat rules should not depend on animation frame callbacks until we intentionally add that bridge.

### Locked Next Direction: Combat-Survival Loop

This is the next direction set in stone for the prototype.

Goal:

- Make combat intentional instead of merely visible.
- Make survival systems matter during combat.
- Keep world, survival, and combat connected without turning the prototype into a large RPG too early.

Locked near-term order:

1. Directional attack and knockback
   - Attacks should primarily hit in front of the player based on facing.
   - Enemies should recoil or move backward on hit.
   - Hit feedback should remain clear and quick.

2. Enemy response clarity
   - Enemy telegraphs stay readable before damage.
   - Enemy recovery/cooldown should be visible enough to learn.
   - The player should be able to understand why they were hit.

3. Campfire as combat-survival anchor
   - Campfire safety should affect enemy pressure near its radius.
   - Fighting near a campfire should feel safer, not automatic.
   - Current status: active fire makes enemies more cautious by reducing chase range, reducing strike range, and slowing stalking while the player is inside the fire radius.
   - Night pressure should make this choice matter.
   - The campfire anchors exploration; it must not trap the player in one spot.

### Wolf Fairness Contract v1

Current implementation target:

- The wolf has simple needs: hunger, fear, territory pressure, and computed boldness.
- Hunger rises over time and rises faster under night pressure.
- Fear rises near active fire, after being hit, after missing, and after respawn grace.
- Territory pressure rises when the player pushes into the wild edge.
- The wolf uses readable phases: stalking, telegraphing, lunging, recovering.
- Stalking and telegraphing do not deal damage.
- Lunge direction is committed when telegraph starts.
- Damage can happen only during lunge and only once per lunge.
- Missed lunges raise fear and create longer recovery.
- Hitting the wolf raises fear and forces recovery.
- Respawn forces wolf recovery/grace so the player cannot be instantly killed again.
- Creature damage response now lives in a reusable rule module instead of being wolf-only.
- Damage response scales fear/recovery by damage ratio and critical remaining health.

Design reason:

The wolf should be dangerous because it makes readable decisions, not because it is a damage blob. The player must have time to recognize, retreat, dodge, or create space.

Architecture rule:

The wolf is the first proof of creature needs, not the whole system. Injury, fire, territory, and weakness responses should become reusable living-world methods before they become one-off mob tricks.

### Behavior Memory v1

Current implementation target:

- The world now records early survival behavior across body, combat, tools, fire, and creatures.
- Body memory tracks cold exposure, exhaustion, damage taken, and collapses.
- Combat memory tracks attacks started, hits landed, dodges used, wolf lunges dodged, and hits taken.
- Tool memory tracks gathered item kinds and leaves room for future weapon/fuel use tracking.
- Fire memory tracks first fire rebuild, time near active fire, and fighting near fire under threat.
- Creature memory tracks wolf hits, lunges faced, and lunges avoided.
- Cleaner Roll is the first earned smoothness unlock.
- Cleaner Roll unlocks after repeated avoided wolf lunges and dodge behavior while keeping hits taken low.
- Cleaner Roll slightly lowers roll stamina cost and roll cooldown.

Design reason:

Evolution begins as memory. The child does not choose a class; repeated answers under pressure quietly change what the body can do.

### Threat Signal v1

Current implementation target:

- The player receives a clear visual danger signal when the wolf is an immediate threat.
- Threat is derived from wolf state and boldness, not random UI timing.
- Telegraphing, lunging, or close bold stalking trigger a red warning tint and player-centered danger ring.

Design reason:

Surprise combat is allowed, but unreadable fatal danger is not. The signal gives the player a life-or-death chance to respond without explaining the system in text.

4. Resource pressure
   - Resources should support survival choices, not become busywork.
   - Food, herbs, wood, and stone should feed into preparation for danger.

5. Exploration-opening advancement
   - Add ways to leave the main fire for longer as the player advances.
   - Early candidates: banked fire, carried ember, temporary wayfires.
   - These should emerge from repeated behavior recipes where possible.

6. Placeholder art replacement after behavior proves useful
   - Campfire visual upgrade before character art.
   - Enemy visual upgrade before player animation.
   - Player animation only after combat states are stable enough to animate against.

What remains flexible:

- Exact damage values.
- Exact stamina costs.
- Exact enemy health.
- Exact campfire radius/fuel time.
- Exact resource quantities.

What is not flexible:

- Simulation stays source of truth.
- Renderer only visualizes state and effects.
- Combat phases stay explicit.
- Survival mechanics must connect to the world, not float as isolated meters.
- New systems need tests when they affect timing, state, damage, resource costs, or win/loss pressure.

## Inventory And Crafting

Initial items:

- Twigs.
- Dry grass.
- Bark.
- Wood.
- Stone.
- Herbs.
- Food.
- Campfire.
- Stone edge.
- Branch club.

Initial recipes:

- Feed Fire = 1 wood + nearby active fire.
- Simple Poultice = 1 herb + 1 bark.
- Stone Edge = 1 stone + 1 bark + 1 twig.
- Branch Club = 1 wood + 1 bark.

Deferred recipes:

- Cooked food = 1 food + active campfire.
- Torch or ember bundle = fuel material + active campfire.

Inventory should remain simple until the survival loop is fun.

The first UI should be a beginner satchel and making panel, not a large RPG grid. It should answer two questions:

- What do I have?
- What can I make from what I understand?

## Art Direction

### Visual North Star

Cel-shaded anime fantasy seen from a classic top-down action RPG camera.

The world should look illustrated, clean, vibrant, and readable. It should avoid muddy realism, noisy pixel clutter, and generic retro-brown RPG styling.

### Shape Language

World:

- Rounded terrain masses.
- Strong readable silhouettes.
- Layered foliage clusters.
- Soft but clear shadow shapes.
- Broad color regions with crisp highlight edges.

Player:

- Small heroic silhouette.
- Cloak, scarf, hair, or shoulder shape that animates well.
- Bright accent color so the player always reads against grass and night.
- Bottom-center anchor for every frame.

Enemies:

- Distinct silhouette before details.
- Slightly supernatural fantasy shapes.
- Clear windup/attack pose readability.
- Eye glow or outline accent for nighttime readability.

UI:

- Minimal persistent HUD.
- Game-world material language: etched light, spirit-glass, field notes, simple icon strips.
- No generic dashboard feel.
- Keep the playfield mostly clear.

### Palette Direction

Core palette:

- Verdant greens.
- Warm gold sunlight.
- Deep ink-blue shadows.
- Coral danger accents.
- Cyan or pale gold magic accents.
- Small purple supernatural accents only where it means danger or mystery.

Avoid:

- One-note purple-blue gradient UI.
- Brown/orange-heavy survival game palette.
- Beige parchment everywhere.
- Overly dark grim fantasy.
- Noisy tile repetition.

### Lighting Direction

Use stylized 2D compositional lighting first.

Initial:

- World tint shifts by time of day.
- Player aura pulse.
- Campfire glow.
- Enemy glow.

Later:

- Light radius affects world mood.
- Darkness modifies enemy behavior.
- Soft cel-shaded shadow layers.

Avoid early:

- Heavy shader systems.
- Complex dynamic lighting.
- Full-screen effects that hide gameplay.

## Pixel Lab Asset Plan

### Asset Order

1. Environment style sheet.
2. Terrain base tiles and foliage.
3. Resource nodes.
4. Campfire.
5. Player seed frame.
6. Player idle and walk strip.
7. Player roll strip.
8. Player attack strip.
9. First enemy seed frame.
10. Enemy idle, stalk, windup, strike, hurt.
11. Hit slash and gather FX.

### Player Sprite Requirements

Style:

- 2D pixel art.
- Top-down three-quarter Zelda-like RPG view.
- Cel-shaded anime fantasy.
- Transparent background.
- Crisp pixel clusters.
- Readable at 32-48 px in game.

Technical:

- Fixed frame size.
- Bottom-center anchor.
- Consistent scale across frames.
- Same silhouette and palette across every animation.
- No background scenery.
- No labels.
- No poster composition.

Recommended first player set:

- Idle south: 4 frames.
- Walk south/east/north/west: 6 frames each.
- Roll south/east/north/west: 6 frames each.
- Attack south/east/north/west: 6 frames each.

We should approve one seed frame before generating full strips.

### Terrain Requirements

First terrain set:

- Grass base.
- Tall grass.
- Dirt clearing.
- Tree cluster.
- Flower/herb node.
- Stone node.
- Wood/branch node.
- Campfire unlit/lit.

Terrain should support readable collision and resource placement. Beauty matters, but collision boundaries must be clear.

See `ENVIRONMENT_ART_PLAN.md` for the environment-first Pixel Lab prompts, technical requirements, and acceptance checklist.

Current active environment brief:

- Use `ENVIRONMENT_ASSET_KIT_V1.md` for the first strict Pixel Lab pass.
- The style anchor is reference-like top-down RPG readability, translated into colder cel-shaded anime survival fantasy.
- The first batch is dead fire pit, leaf bed, twig bundle, dry grass clump, bark strip, striking stone, and tree cluster.
- These assets should replace debug-looking placeholders before deeper environment mechanics are added.

## Technical Architecture

### State Ownership

`src/game/simulation`

Owns:

- Player state.
- Combat state.
- World state.
- Inventory.
- Resources.
- Enemies.
- Survival rules.
- Crafting rules.
- Saveable state.

`src/phaser`

Owns:

- Scene setup.
- Generated textures or loaded sprites.
- Animation playback.
- Camera.
- Visual effects.
- Input plumbing.

`src/ui`

Owns:

- DOM HUD.
- Menus.
- Inventory panel.
- Pause/settings later.

Rule:

Do not put gameplay rules directly inside Phaser scene callbacks unless the code is only adapting input or syncing visuals.

## Test Strategy

Systems that need tests:

- Combat phase transitions.
- Stamina spending and regeneration.
- Dodge invulnerability timing.
- Attack hit windows.
- Enemy state changes.
- Crafting costs.
- Resource respawn.
- Hunger drain and starvation damage.
- Collapse/respawn behavior.
- Campfire safety radius when added.
- World mood/night pressure rules.

Visual systems do not need unit tests first, but they need browser smoke tests and screenshots after major changes.

## Implementation Roadmap

### Phase 1: Freeze First Playable Baseline

Status: mostly complete.

Tasks:

- Keep current prototype running.
- Add this plan.
- Add basic loss condition.
- Add simple restart.
- Add food restore behavior.

### Phase 2: World Feel Pass

Priority: highest.

Tasks:

- Improve terrain composition.
- Add campfire glow and safety radius.
- Add mood-based color shift.
- Add resource respawn visuals.
- Add ambient particles or fireflies.
- Add Pixel Lab terrain placeholders.

### Phase 3: Combat Smoothness Pass

Priority: second.

Tasks:

- Add directional attack arcs. Status: visual arc added, directional hit logic still next.
- Add knockback. Status: next.
- Add hit-stop. Status: lightweight hit feedback state added, stronger pause feel later.
- Add enemy telegraphs. Status: initial telegraph added.
- Add animation state resolver.
- Add attack buffer.

### Phase 4: Pixel Lab Character Pipeline

Tasks:

- Generate and approve player seed frame.
- Normalize idle/walk/roll/attack strips.
- Replace generated player texture.
- Add animation resolver.
- Generate first enemy seed and strips. Status: wolf idle-watch seed v1 generated and loaded as the default enemy visual; previous low wolf seed preserved as the future stalk pose; animation strips still next.

### Phase 5: Survival Loop

Tasks:

- Add food use.
- Add campfire placement.
- Add night danger radius.
- Add simple death/restart.
- Add a goal: survive until dawn.

### Phase 6: Prototype Evaluation

Questions:

- Does the world feel alive without final art?
- Does survival create useful pressure?
- Does combat feel readable and expandable?
- Is the architecture still clean?
- What mechanic should become the identity of this game?

## Next Safest Step

Add the survival loop completion condition:

- Food restores hunger.
- Campfire can be placed.
- Campfire reduces nearby night pressure.
- Player survives until dawn.
- Add tests for food use, campfire cost, and night pressure reduction.

After that, start the Pixel Lab player seed frame or continue the wolf pipeline into a small animation proof.

## Recent Implementation Notes

### Wolf Visual Seed v1

Status: implemented.

- Created a cel-shaded wolf seed asset as the first real enemy visual.
- Preserved the high-resolution transparent source for future animation work.
- Created a normalized runtime version for the Phaser scene.
- Loaded the wolf runtime asset through `assetKeys.enemy`.
- Stopped the old generated enemy placeholder from overwriting the wolf texture.
- Added a wolf-specific actor container with a wider shadow and bottom-biased sprite anchor.
- Removed the old enemy wind bob so the wolf no longer inherits placeholder shaking.

Correction:

- The first generated wolf pose reads as stalk/threat, not neutral idle.
- It has been preserved as `wolf-stalk-seed-v1` / `wolf-stalk-game-v1`.
- A new `wolf-idle-watch-seed-v1` / `wolf-idle-watch-game-v1` is now the default loaded enemy visual.
- Animation language should treat standing/listening as idle, low body posture as stalk, planted warning as threat, and committed motion as lunge.

### Wolf Idle Watch Animation v1

Status: replaced by v2.

- Added a 6-frame `wolf-idle-watch-sheet-v1.png` spritesheet using fixed 96x96 cells.
- Added `animationKeys.wolfIdleWatch` to the asset manifest.
- Loaded the sheet in `BootScene` and registered a looping Phaser animation.
- Switched enemy rendering from static image body to a sprite body.
- Added a minimal enemy animation resolver:
  - `watching` plays `wolf-idle-watch`.
  - non-watch states hold frame 0 until their own strips exist.

Verification:

- `npm.cmd test` passed: 45 tests.
- `npm.cmd run build` passed.

### Wolf Idle Watch Animation v2

Status: implemented.

- Generated a stronger 8-frame idle-watch strip.
- Normalized it into `wolf-idle-watch-sheet-v2.png` with fixed 96x96 cells.
- Added `wolf-idle-watch-preview-v2.png` for review.
- Cleaned a small generated tail-motion artifact from the sheet.
- Updated `BootScene` to load v2 and play frames 0-7.
- Kept the same animation key so the render resolver did not need to change.

Adjustment:

- The full 8-frame loop felt unnatural because it repeated too many behaviors.
- Runtime idle playback now uses frames `[0, 1, 2, 1]` at 4 fps with a short repeat delay.
- The unused stronger scan/tail frames remain in the sheet for later alert or idle-variant work.

### Tree Scale Pass v1

Status: implemented.

- Increased tree visual scale so trees read as actual terrain-shaping objects beside the wolf.
- Edge trees are now larger than resource props and wolf-height objects.
- Wild-side trees are larger still to make the wolf territory feel wooded.
- Expanded authored tree collision radii to match the larger tree bases.
- Kept collision debug toggle available with `K`.

Verification:

- `npm.cmd test` passed: 45 tests.
- `npm.cmd run build` passed.
- Browser reload passed with no console errors.

Adjustment:

- Trees were scaled up again after comparing them to the wolf's improved creature scale.
- Tree draw depth now uses y-sorted actor depth with a base offset, so actors can pass visually behind or in front of trees instead of always drawing over them.
- Collision radii were expanded again to keep the larger trees physically meaningful.

### Tall Tree / Under-Canopy Pass v1

Status: implemented.

- Changed tree placement so each authored tree point acts more like the trunk/base anchor.
- Set tree origins near the bottom of the sprite instead of the center.
- Increased vertical scale more than horizontal scale so trees feel taller without becoming huge round blobs.
- Reduced tree collision radii after the height pass so canopy can overhang playable space while trunk/root collision stays fair.
- Kept y-sorted tree depth so player/wolf draw behind or in front based on foot position versus tree base.

Verification:

- `npm.cmd test` passed: 45 tests.

### Pause Screen v1

Status: implemented.

- Added `P` as a pause toggle.
- Added `world.paused` to simulation state.
- While paused, simulation updates return early so world time, player movement, combat, resources, and enemies do not advance.
- Phaser animations and tweens pause/resume with the game state.
- Added a HUD pause overlay with "Paused" and "Press P to return."
- Added tests for pausing, frozen simulation updates, and resuming.

Verification:

- `npm.cmd test` passed: 47 tests.
- `npm.cmd run build` passed.
- Browser check confirmed the pause overlay activates with `P`, then deactivates with `P`, with no console errors.

### Tree Occlusion Reveal Lens v1

Status: implemented.

- Added runtime canopy zones for current tree views.
- If the player is inside a canopy zone and the tree draws over the player, that specific tree fades to partial alpha.
- Added a subtle circular player reveal around the character while occluded.
- Added canopy zone ellipses to the `K` collision/debug overlay so trunk collision and canopy cover can be tuned separately.
- This is the prototype-friendly route before shader masking: it proves detection, readability, and tree cover behavior without new render pipeline complexity.

Verification:

- `npm.cmd test` passed: 47 tests.
- `npm.cmd run build` passed.
- Browser reload passed with no console errors.

### Biome Tree Placement Foundation v1

Status: implemented.

- Moved starting-area tree placement out of scene-only arrays and into biome-aware map data.
- Defined the first zone biome as `cold-wild-grassland`.
- Tagged active ground materials as `cold-grass` and `damp-dirt`.
- Each authored tree now carries:
  - biome id
  - compatible ground material
  - zone tone tags such as `unknown-woods`, `first-zone`, `wolf-territory`, and `edge-growth`
  - variant id
  - trunk collision radius
  - canopy offset and canopy radii
  - tree scale
  - wind weight placeholder
- Tree collision is now derived from trunk collision data, keeping canopy cover separate from physical blocking.
- `WorldScene` now renders trees from `startingArea.environment.trees`.
- Added biome tests so first-zone trees must match the biome/ground and keep trunk collision smaller than canopy cover.

Verification:

- `npm.cmd test` passed: 49 tests.
- `npm.cmd run build` passed.
- Browser reload passed with no console errors.

### Environment Asset Catalog v1

Status: implemented.

- Added `environmentCatalog.ts` as the content-side asset registry for biome-bound environment assets.
- Catalog entries define:
  - asset id
  - texture key
  - environment role
  - valid biomes
  - valid ground materials
  - tone/system tags
  - light profile
  - baked-ground policy
- Starting-area trees now reference catalog asset ids.
- `WorldScene` resolves tree textures through the catalog instead of inferring asset keys from raw variants.
- Biome tests now verify that authored trees use catalog assets compatible with their biome and ground material.
- Tests also enforce no baked ground, upper-left lighting, trunk-collision tags, and canopy-cover tags for current tree assets.

Verification:

- `npm.cmd test` passed: 50 tests.
- `npm.cmd run build` passed.

### Split Tree Replacement Batch v1

Status: implemented.

- Began replacing current whole-tree placements with assembled trunk/canopy trees.
- Converted five authored placements to the split system:
  - first shelter tree
  - two southern edge trees
  - two wolf-territory trees
- Added per-placement options for canopy offset, canopy cover radius, scale, and wind weight so trees can vary without generating a new asset for every placement.
- Kept whole-tree rendering supported so we can migrate gradually and compare old versus new in the same scene.
- Future trunk generation note: trunk tops should not be perfectly flat. They should include partial branch forks or empty broken limbs to sell the illusion that the canopy is attached above the visible trunk.

Verification:

- Replacement tests added for assembled trees.
- Browser reload passed with no console errors.
- `npm.cmd run build` passed.
- Browser smoke at `http://127.0.0.1:5173/` loaded with no console errors.

### Zone Tree Placement Roles v1

Status: implemented.

- Converted every current Zone 1 tree placement to the assembled trunk/canopy path.
- Added `placementRole` to tree data so each tree has a zone-system purpose instead of being only a coordinate.
- Current placement roles:
  - `shelter`: early safety/cover near the first clearing.
  - `boundary`: physical and visual edge shaping.
  - `threshold`: transition from known space toward unknown space.
  - `wolf-cover`: trees that support wildlife danger readability and future AI cover logic.
  - `resource-parent`: trees eligible to parent dependent spawns such as fallen branches later.
  - `screen-frame`: edge trees used primarily for camera composition and world scale.
- Added per-tree scale, canopy cover, wind weight, and collision tuning under the same helper so future zones can use one placement pattern with different biome assets.
- Kept old whole-tree renderer support temporarily, but no active Zone 1 placement depends on it now.

Verification:

- Added tests that all active Zone 1 trees use assembled rendering.
- Added tests that authored trees expose placement roles required by the future zone system.

### Tree Collision Anchor v1

Status: implemented.

- Added `trunkCollisionOffsetY` to tree placement data.
- Tree visual anchors still use the trunk/root base for drawing.
- Tree collision coverage now begins at the visual root/base and reaches roughly one quarter up the trunk object.
- Starting-area collision data is generated from `tree.y + trunkCollisionOffsetY`.
- Tests now verify that collision centers are offset from the root base and still tied to trunk radius data.

Verification:

- `npm.cmd test` passed: 52 tests.
- `npm.cmd run build` passed.

### Trunk Body Mask Refinement v1

Status: implemented.

- Tightened the extracted trunk-body asset so lower buttress roots stay in the walk-over root layer.
- The y-sorted trunk-body layer now contains only the upright central trunk and a small base transition.
- This fixes the player being visually covered by side root flare while still keeping the solid trunk able to occlude the actor.

Verification:

- `npm.cmd test` passed: 53 tests.
- `npm.cmd run build` passed.

### Tree-Dependent Branch Spawning v1

Status: implemented.

- Added the first explicit ecosystem rule in `src/game/content/ecosystem.ts`.
- Trees with `placementRole: resource-parent` now parent fallen branch resource seeds.
- Fallen branches spawn in a controlled band around the parent tree instead of being arbitrary hand-placed resources.
- Tree-dependent resources carry source metadata:
  - source type
  - parent tree id
  - ecosystem rule id
- `createGameState()` now includes these generated branches in the initial resource list.
- This is deterministic for the prototype; later passes can add wind, storm, day/night, harvesting pressure, and regeneration behavior.

Verification:

- Added ecosystem tests for resource-parent trees and tree-dependent branch resources.
- `npm.cmd test` passed: 55 tests.
- `npm.cmd run build` passed.

### Ecosystem Branch Readability v1

Status: implemented.

- Tree-dependent fallen branches now render with deterministic scale and rotation variation so they read less like copied props.
- The hidden `K` debug overlay now draws parent links from tree-dependent branches back to their source tree.
- Added ecosystem helpers for checking tree-dependent source metadata, parent lookup, branch spawn band, and trunk-collision avoidance.
- Added tests proving generated fallen branches stay tied to `resource-parent` trees, preserve source metadata in game state, and do not spawn inside the parent trunk collision band.
- This keeps the first ecosystem rule inspectable before adding randomized spawns, seasonal rules, or wildlife interactions.

Verification:

- `npm.cmd test` passed: 56 tests.
- `npm.cmd run build` passed.

### Ecosystem Spawn Rule Registry v1

Status: implemented.

- Converted the first tree-dependent resource behavior from a one-off branch helper into an inspectable spawn-rule registry.
- The current fallen-branch rule now declares:
  - rule id
  - seed id prefix
  - spawned resource kind
  - eligible parent tree role
  - amount and respawn timing
  - allowed distance band from the parent trunk
  - parent trunk collision exclusion
  - deterministic prototype offsets
- `createTreeDependentResourceSeeds()` now generates branches from this registry while preserving the current visible branch layout.
- `ResourceNode.source.rule` now uses the ecosystem rule id type so future rules can expand without losing source metadata.
- This is still deterministic. Randomized spawns should come next only after each rule declares its valid parent, material, distance, and collision constraints.

Verification:

- `npm.cmd test` passed: 57 tests.
- `npm.cmd run build` passed.

### Controlled Resource Randomization v1

Status: implemented.

- Tree-dependent resource rules now support stable seeded selection.
- The fallen-branch rule now defines more valid candidate offsets than active spawned branches.
- `createTreeDependentResourceSeeds(seed)` chooses active branches from valid candidates by stable seed score.
- The default seed keeps the prototype deterministic, while alternate seeds can produce different branch layouts without changing authored map data.
- Spawn candidates are still filtered through the rule's distance band and parent trunk collision exclusion before selection.
- This gives Zone 1 the first controlled version of "not every run/place needs to look exactly hand-placed" while preserving authored guardrails.

Verification:

- `npm.cmd test` passed: 59 tests.
- `npm.cmd run build` passed.

### Ecosystem Seed State v1

Status: implemented.

- Exported the default Zone 1 ecosystem seed from the ecosystem content module.
- Added `ecosystem.seed` to `GameState`.
- `createGameState({ ecosystemSeed })` now uses the requested seed when generating tree-dependent resource nodes.
- Restart now preserves the active ecosystem seed, so a future seeded world or save file does not silently reset to the default layout after failure.
- Tests now cover default seed state, custom seeded resource creation, and restart seed preservation.

Verification:

- `npm.cmd test` passed: 62 tests.
- `npm.cmd run build` passed.

### Ecosystem Lifecycle v1

Status: implemented.

- Tree-dependent resources are now owned by ecosystem lifecycle rules instead of generic inventory respawn.
- Depleted tree-dependent branches remain depleted after gathering and do not use the simple timed resource respawn path.
- `GameState.ecosystem.lastRegenerationDay` tracks when the ecosystem last refilled rule-driven resources.
- The world system regenerates missing/depleted tree-dependent resources at the next dawn window using the active ecosystem seed.
- Regenerated resources still come from valid seeded candidates and keep their parent tree/rule source metadata.
- This is the first step from "resource placement" toward "the world produces things over time."

Verification:

- `npm.cmd test` passed: 64 tests.
- `npm.cmd run build` passed.

### World Event Influence v1

Status: implemented.

- Added `ecosystem.windfallPressure` and `ecosystem.lastRegenerationPressure` to game state.
- Night pressure and dawn/dusk glow now accumulate ecosystem windfall pressure over time.
- Dawn regeneration now requires enough accumulated windfall pressure before tree-dependent resources refill.
- Regeneration consumes part of the accumulated pressure and records the pressure that caused the refill.
- This gives the current branch lifecycle a world cause: fallen branches are no longer only day-timer refills; they are tied to accumulated environmental pressure.
- Future storm, wind, season, animal, and player-impact rules can feed this same pressure path.

Verification:

- `npm.cmd test` passed: 66 tests.
- `npm.cmd run build` passed.

### Ecosystem Debug Readability v1

Status: implemented.

- Extended the hidden `K` debug overlay with a fixed ecosystem state panel.
- The panel shows:
  - active ecosystem seed
  - accumulated windfall pressure
  - last regeneration day and pressure
  - active/depleted tree-dependent resource counts
  - current day/time/night pressure
- This keeps ecosystem tuning inspectable without adding player-facing tutorial UI.
- The existing `K` overlay still shows tree trunk collision, canopy cover, player collision, and branch-parent links.

Verification:

- `npm.cmd test` passed: 66 tests.
- `npm.cmd run build` passed.

### Zone-Dependent Herb Ecosystem v1

Status: implemented.

- Added the first non-tree ecosystem resource rule: `dew-herb-near-first-shelter`.
- Added zone-dependent source metadata with `zoneId`, so resource ownership can come from a biome/zone rule instead of only a parent tree.
- `createEcosystemResourceSeeds()` now combines tree-dependent branches and zone-dependent herbs through one ecosystem-owned resource path.
- Herb candidates are seeded, collision-filtered, and capped by rule max active count.
- Generic inventory respawn now skips all ecosystem-owned resources, not just branches.
- Dawn regeneration now restores ecosystem-owned branches and herbs through the same world-pressure lifecycle.
- The hidden `K` overlay distinguishes branch/tree links from zone-dependent herb markers and counts active branches/herbs.

Verification:

- `npm.cmd test` passed: 70 tests.
- `npm.cmd run build` passed.

### Beginner Crafting Registry And UI v1

Status: implemented.

- Added a data-driven beginner recipe registry for:
  - Feed Fire.
  - Simple Poultice.
  - Stone Edge.
  - Branch Club.
- Added a crafting system that checks inventory costs, nearby active-fire context, and recipe effects.
- Added `stoneEdges` and `branchClubs` to inventory state as the first crafted tool outputs.
- Added beginner UI state for inventory/crafting panels.
- Added `I` for the satchel panel and `Tab` for the making panel.
- Added number-key recipe execution while the making panel is open.
- Updated the HUD hint away from campfire placement and toward satchel/making discovery.
- Kept the first-fire opening behavior intact.

Verification:

- `npm.cmd test` passed: 76 tests.
- `npm.cmd run build` passed.
- Browser smoke check loaded the prototype with no console errors.

### Melee Seed Evolution v1

Status: implemented.

- Added explicit melee seed profiles for:
  - Bare Hands.
  - Branch Club.
  - Stone Edge.
- Branch Club is the first blade-line seed:
  - wider reach
  - broader swing shape
  - blade seed affinity gain on attack
- Stone Edge is the first axe-line seed:
  - shorter reach
  - narrower chop shape
  - higher damage and stamina commitment
  - axe seed affinity gain on attack
- Crafting a Branch Club or Stone Edge now equips that melee seed immediately.
- Combat reads the active melee seed profile for stamina cost, damage, reach, active timing, recovery, and hit-stop.
- Behavior memory now records branch-club attacks and stone-edge attacks separately.
- Evolution state now stores equipped melee seed, blade seed affinity, and axe seed affinity.
- The HUD combat line and satchel panel now expose the held seed and early affinity values.

Verification:

- `npm.cmd test` passed: 78 tests.
- `npm.cmd run build` passed.

### Trunk Body Mask Refinement v2

Status: implemented.

- Tightened the actor-sorted trunk-body layer again after side-root overlap review.
- The trunk-body asset now keeps only the upright central column and stops before the lower buttress flare.
- Side roots and buttress shapes remain in the root/base layer so the player can walk visually over them.

Verification:

- `npm.cmd test` passed: 53 tests.
- `npm.cmd run build` passed.

### Flat-Ended Trunk Collision v1

Status: implemented.

- Replaced round-ended tree trunk capsule behavior with a flat-ended vertical trunk band.
- This prevents the lower collision cap from extending too far below the visible trunk/root alignment.
- Tree collision still starts at authored trunk base and extends upward through `segmentEndY`.
- The player is only blocked below the trunk by the player's own collision radius, not by the tree's full trunk radius.
- Added a regression test proving a player just below the trunk start is not blocked by trunk width.

Verification:

- `npm.cmd test` passed: 53 tests.
- `npm.cmd run build` passed.

### Three-Layer Tree Render v1

Status: implemented.

- Split the current trunk/root PNG into aligned root and trunk-body runtime assets.
- Assembled trees now render three layers:
  - root/base layer under actors
  - trunk-body layer y-sorted with actors
  - canopy layer above actors
- This lets the player visually walk over roots without appearing painted on top of the solid trunk.
- Asset catalog now recognizes `tree-root`, `tree-trunk`, and `tree-canopy` roles for assembled trees.
- Current split is a prototype extraction from the existing trunk art. Future generated tree assets should be authored as separate roots, trunk body, and canopy from the start.

Verification:

- `npm.cmd test` passed: 52 tests.
- `npm.cmd run build` passed.

### Tree Trunk Capsule Collision v1

Status: implemented.

- Upgraded tree collision from a single circle into a short vertical capsule.
- Collision now begins at the visual root/base and extends upward farther into the trunk, roughly another quarter of the trunk height.
- The capsule keeps trunk width controlled by `trunkCollisionRadius` while extending vertical coverage with `segmentEndY`.
- Player collision resolves against the nearest point on the trunk span instead of only the center of a circle.
- The hidden `K` collision overlay now draws both ends of trunk collision and side rails for tuning.

Verification:

- `npm.cmd test` passed: 52 tests.
- `npm.cmd run build` passed.

### Tree Root Draw Order v1

Status: implemented.

- Assembled tree trunk/root art now renders in the low environment prop band.
- The player can visually walk over root shapes.
- Canopies still render above actors and remain responsible for under-tree cover and reveal-lens behavior.
- Collision remains separate from draw order and still comes from map data.

Verification:

- `npm.cmd test` passed: 52 tests.
- `npm.cmd run build` passed.

### Split Tree Assembly v1

Status: implemented.

- Generated the first Zone 1 tree as separate runtime parts: trunk/root base and overhead canopy.
- Kept both new assets free of baked grass, dirt, rocks, or other ground material so placement remains controlled by biome ground data.
- Added catalog roles for `tree-trunk` and `tree-canopy`.
- Added one authored assembled tree in the first-zone clearing approach to prove the system before replacing every tree.
- Trunk collision still comes from map data.
- Canopy cover still comes from map data and uses the existing reveal-lens behavior when the player is hidden.
- `WorldScene` now supports both current whole-tree sprites and new assembled trees, so we can migrate gradually without breaking the map.

Verification:

- `npm.cmd test` passed: 50 tests.
- `npm.cmd run build` passed.

### Hotbar UI And Crafting Input Refactor v1

Status: implemented.

- Added a six-slot beginner hotbar driven by simulation state.
- Number keys now select/use hotbar slots instead of crafting recipes.
- Current slot plan:
  - 1: Simple Poultice.
  - 2: Food.
  - 3: Branch Club.
  - 4: Stone Edge.
  - 5-6: locked future growth slots.
- Simple Poultice now crafts into a carried poultice item instead of healing immediately.
- Poultice use now happens from the hotbar and consumes one poultice.
- Branch Club and Stone Edge can be equipped from hotbar slots after crafting.
- Crafting input now uses bracket keys to move selection and Enter to craft the selected recipe while the Making panel is open.
- The HUD now uses the generated PixelLab UI assets for hotbar slots, selected slot overlay, satchel panel, and recipe cards.

Design reason:

The hotbar protects number keys for moment-to-moment play. Crafting becomes a deliberate panel action, while carried items and crude tools start feeling like things the player owns and chooses under pressure.

Verification:

- `npm.cmd test` passed: 81 tests.
- `npm.cmd run build` passed.
- Local server check at `http://127.0.0.1:5173/` returned 200.
- Browser smoke confirmed six hotbar slots render with no console errors.

### Basic Workbench Station Direction v1

Status: design correction recorded.

- Binding Spot should not become its own early crafted station.
- Binding, twine, poultice-adjacent work, and other simple assembly actions should be integrated into a Basic Workbench station.
- The existing `binding-spot-v1.png` asset remains available as a visual reference or ingredient-cluster candidate, but not as a standalone station target.
- The `badge-binding-v1.png` UI asset should represent a Basic Workbench binding capability or recipe context.

Design reason:

Early station growth should stay understandable. A Basic Workbench can carry multiple primitive making actions without fragmenting Zone 1 into too many tiny station types.

### Alive Character Condition And Equipment Foundation v1

Status: implemented.

- Split current held-weapon state out of evolution and into `equipment.mainHand`.
- Added starter equipment slots:
  - `mainHand`: current melee seed or held weapon/tool seed.
  - `tool`: reserved for future non-weapon tools.
  - `body`: reserved for future worn gear/clothing.
- Combat, crafting, hotbar use, and HUD held-item text now read from equipment state.
- Evolution remains responsible for earned capability, affinities, and body/combat growth.
- Player presentation now has named body, shadow, and held-item layers so future gear/tool sprites can attach cleanly.
- Cold pressure now changes the player's posture/tint/shadow as a condition response instead of using placeholder shaking.
- Branch Club and Stone Edge now have small generated held-item presentation textures for the current prototype.
- Crafting panel readability was improved with stronger backing opacity and darker recipe text so survival choices remain legible over the living world.

Alive-world cross-check:

The world is still the pressure source. Cold affects how the body reads. Fire and survival choices remain visible around the UI, but decision panels no longer let the environment interfere with critical text. Equipment is now separate from evolution so future tools and gear can change what the player carries without overwriting who the player is becoming.

Verification:

- `npm.cmd test` passed: 81 tests.
- `npm.cmd run build` passed.
- Browser smoke loaded `http://127.0.0.1:5173/`, rendered one canvas, six hotbar slots, the active Making panel, and no console errors.

### Starter Child Character Visual Standard v1

Status: implemented.

- Added `CHARACTER_VISUAL_STANDARD.md` as the source standard for the first real player character before sprite generation.
- Added a typed `starterChildCharacterStandard` content contract in `src/game/content/characterVisualStandard.ts`.
- Locked the first character target to:
  - `64 x 64` runtime frames.
  - `36-44 px` child visual height.
  - bottom-center foot anchor at `x=0.5`, `y=0.78`.
  - top-down 3/4 cel-shaded anime survival fantasy.
  - transparent background with no baked ground, scenery, labels, or UI.
- Required future equipment sockets:
  - `mainHand`
  - `tool`
  - `body`
  - `back`
  - `hands`
- Required condition states:
  - cold
  - warming
  - exhausted
  - hurt
  - under threat
- Required future animation groups now include cold/warm idle, walking, gathering, fire-kneel, bare attack, main-hand attack, dodge roll, hurt, collapse, and use-item.

Alive-world cross-check:

The player standard now treats condition as a world/body response instead of a class identity. The child is designed to visually answer cold, warmth, exhaustion, injury, threat, tools, and carried gear. This keeps the world alive because the player visibly changes in response to it.

Verification:

- `npm.cmd test` passed: 87 tests.
- `npm.cmd run build` passed.

### Starter Child PixelLab Seed Pass v1

Status: review candidate created.

- Generated three PixelLab passes against the starter-child visual standard.
- Saved all rotations under `public/assets/characters/source/`.
- Current best candidate:
  - `pixellab-2026-05-21-starter-child-cold-v3-state`
  - PixelLab id: `21e5e1bc-deaf-4a23-9556-fb093a240444`
  - 8 directions
  - `68 x 68`
  - transparent PNGs
- V1 and V2 are kept as source/reference but not accepted.
- V3-state is not wired into gameplay yet because it must be visually approved and normalized into the `64 x 64` runtime frame first.

Alive-world cross-check:

The useful iteration was not the neutral child avatar. The useful iteration was the state variant where cold visibly changes the body: arms tuck in, posture closes, and the child reads as affected by the world before UI explains the condition.

Next gate:

- Approve, reject, or revise the V3-state silhouette.
- If approved, normalize south/east/north/west into the runtime frame and wire a first static player replacement.
- If rejected, iterate from V3-state instead of starting over, preserving identity while pushing posture, clothing, or scale.

### Role-Locked Hotbar Contract v1

Status: implemented.

- Reworked the six-slot hotbar into fixed role lanes:
  - 1-4: ability slots.
  - 5: healing slot.
  - 6: utility, mobility, or defensive slot.
- Moved Branch Club and Stone Edge into the first two ability lanes for now.
- Moved poultice use into the dedicated heal lane.
- Removed food from the combat hotbar so eating does not compete with ability/heal/utility muscle memory.
- Added `hotbar.utilityCooldownMs` as the first dedicated cooldown foundation for the utility lane.
- Added `updateHotbar` so the utility cooldown ticks separately from combat cooldown and roll cooldown.
- Added HUD role labels: `A1`, `A2`, `A3`, `A4`, `HEAL`, `UTIL`.
- Updated crafting auto-selection so newly made crude melee seeds point at their new ability slots.

Alive-world cross-check:

The hotbar is no longer just a bag shortcut. It now describes the player's emerging body of responses: what they can do, how they recover, and what special answer they have under pressure. This keeps room for evolution because future learned behaviors can enter ability lanes without rewriting inventory or equipment.

Verification:

- `npm.cmd test` passed: 89 tests.
- `npm.cmd run build` passed.
- Browser visual smoke was attempted, but Playwright is not installed in this environment. Runtime UI still needs eyeball verification in the open local browser.

### Inventory-Owned Making UI v1

Status: implemented.

- Moved Making from a separate right-side panel into the Satchel UI.
- Satchel is now the parent surface for both carried items and basic crafting choices.
- `Tab` opens the Making subset inside Satchel.
- Closing the Satchel also closes Making, so crafting cannot float as an independent panel.
- The current inventory UI remains compact and early-stage instead of becoming a full RPG inventory screen.

Alive-world cross-check:

Crafting now reads more like the child looking into what they carry and deciding what can be made from it. That keeps the action grounded in the survival loop instead of turning Making into a separate menu mode detached from the world.

Verification:

- `npm.cmd test` passed: 92 tests.
- Browser visual smoke still needs manual eyeball review in the open local browser because Playwright is not installed in this environment.

### Beginner Six-Slot Satchel v1

Status: implemented.

- Changed `Tab` into the Satchel open/close key.
- Changed `M` into the Making subset toggle while the Satchel is open.
- Limited the beginner Satchel to six visible slots.
- Satchel slots now show carried items first and empty spaces after that, instead of listing every possible material in the game.
- Changed the top HUD inventory readout to satchel capacity instead of a full material ledger.
- Added compact in-panel controls:
  - `Tab Close`
  - `M Making`
  - `[ ] Select`
  - `Enter Make`
- Added tests for the six-slot inventory rule and for Making staying dependent on the Satchel parent.

Alive-world cross-check:

The child does not begin with a complete material ledger. They begin with a small carried-space readout: what is actually in hand or in the satchel right now. The upgrade path can later make inventory knowledge broader without giving full-game legibility too early.

Verification:

- `npm.cmd test` passed: 95 tests.
- `npm.cmd run build` passed.
