import { describe, expect, it } from 'vitest';
import { getEnemyDefinition, getEnemyDefinitions } from '../src/game/content/enemies';
import { createEnemyState, createGameState } from '../src/game/simulation/state';

describe('first-zone enemy catalog', () => {
  it('defines small first encounter enemies instead of the wolf as the active baseline', () => {
    expect(getEnemyDefinitions().map((enemy) => enemy.kind)).toEqual([
      'mire-spider',
      'violet-moss-blob',
      'thorn-shell-mite'
    ]);
    expect(getEnemyDefinition('mire-spider').firstEncounterUse).toContain('without the inevitability of a wolf');
  });

  it('starts the prototype without active enemies until trigger zones own spawning', () => {
    const state = createGameState();

    expect(state.enemies).toHaveLength(0);
  });

  it('can opt into a small prototype enemy for combat and enemy system tests', () => {
    const state = createGameState({ includePrototypeEnemies: true });

    expect(state.enemies).toHaveLength(1);
    expect(state.enemies[0].kind).toBe('mire-spider');
  });

  it('creates enemy state from the catalog home and durability values', () => {
    const spider = createEnemyState('mire-spider');
    const definition = getEnemyDefinition('mire-spider');

    expect(spider.x).toBe(definition.home.x);
    expect(spider.y).toBe(definition.home.y);
    expect(spider.homeX).toBe(definition.home.x);
    expect(spider.maxHealth).toBe(definition.maxHealth);
  });
});

