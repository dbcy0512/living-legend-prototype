import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { assetKeys } from '../src/game/assets/manifest';
import { getZoneOnePoiAnchors } from '../src/game/content/maps/zoneOneConcept';

const generatedPoiSprites = [
  {
    key: assetKeys.zone1PoiWaterSource,
    file: 'zone1-poi-water-source-v1.png',
    width: 192,
    height: 144
  },
  {
    key: assetKeys.zone1PoiStoneOutcrop,
    file: 'zone1-poi-stone-outcrop-v1.png',
    width: 176,
    height: 128
  },
  {
    key: assetKeys.zone1PoiHerbBerryPatch,
    file: 'zone1-poi-herb-berry-patch-v1.png',
    width: 176,
    height: 128
  },
  {
    key: assetKeys.zone1PoiClayMudBank,
    file: 'zone1-poi-clay-mud-bank-v1.png',
    width: 170,
    height: 170
  },
  {
    key: assetKeys.zone1PoiAnimalTrail,
    file: 'zone1-poi-animal-trail-v1.png',
    width: 192,
    height: 96
  },
  {
    key: assetKeys.zone1PoiFutureGate,
    file: 'zone1-poi-future-gate-v1.png',
    width: 192,
    height: 160
  },
  {
    key: assetKeys.zone1PoiDeepForestDeadfall,
    file: 'zone1-poi-deep-forest-deadfall-v1.png',
    width: 192,
    height: 128
  },
  {
    key: assetKeys.basicWorkbench,
    file: 'basic-workbench-v1.png',
    width: 128,
    height: 96
  }
] as const;

describe('generated zone one POI sprites', () => {
  it('keeps every PixelLab POI anchor present with stable manifest keys', () => {
    for (const sprite of generatedPoiSprites) {
      const path = join(process.cwd(), 'public', 'assets', 'environment', sprite.file);

      expect(sprite.key).toContain('environment:');
      expect(existsSync(path)).toBe(true);
      expect(readPngSize(path)).toEqual({ width: sprite.width, height: sprite.height });
    }
  });

  it('connects every runtime POI anchor to a generated texture key', () => {
    const generatedKeys = new Set<string>(generatedPoiSprites.map((sprite) => sprite.key));

    for (const anchor of getZoneOnePoiAnchors()) {
      expect(generatedKeys.has(anchor.textureKey)).toBe(true);
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
