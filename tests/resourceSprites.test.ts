import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { assetKeys } from '../src/game/assets/manifest';

const generatedResourceSprites = [
  {
    key: assetKeys.resourceBerryBush,
    file: 'resource-berry-bush-v1.png',
    width: 96,
    height: 80
  },
  {
    key: assetKeys.resourceMedicinalHerb,
    file: 'resource-medicinal-herb-v1.png',
    width: 80,
    height: 72
  },
  {
    key: assetKeys.resourceStoneOutcrop,
    file: 'resource-stone-outcrop-v1.png',
    width: 112,
    height: 88
  },
  {
    key: assetKeys.resourceDryGrassTinder,
    file: 'resource-dry-grass-tinder-v1.png',
    width: 80,
    height: 72
  },
  {
    key: assetKeys.resourceKindlingPile,
    file: 'resource-kindling-pile-v1.png',
    width: 96,
    height: 72
  }
] as const;

describe('generated zone one resource sprites', () => {
  it('keeps the PixelLab resource sprites present with stable manifest keys', () => {
    for (const sprite of generatedResourceSprites) {
      const path = join(process.cwd(), 'public', 'assets', 'environment', sprite.file);

      expect(sprite.key).toContain('environment:resource-');
      expect(existsSync(path)).toBe(true);
      expect(readPngSize(path)).toEqual({ width: sprite.width, height: sprite.height });
    }
  });
});

const readPngSize = (path: string): { width: number; height: number } => {
  const data = readFileSync(path);
  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20)
  };
};
