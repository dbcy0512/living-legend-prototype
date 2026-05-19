import { describe, expect, it } from 'vitest';
import { startingArea } from '../src/game/content/maps/startingArea';
import { getEnvironmentAsset } from '../src/game/content/environmentCatalog';

describe('starting area biome environment', () => {
  const getTreeAssets = (tree: (typeof startingArea.environment.trees)[number]) => (
    tree.renderMode === 'assembled'
      ? [getEnvironmentAsset(tree.rootAssetId), getEnvironmentAsset(tree.trunkAssetId), getEnvironmentAsset(tree.canopyAssetId)]
      : [getEnvironmentAsset(tree.assetId)]
  );

  it('tags every authored tree for the first zone biome and compatible ground', () => {
    for (const tree of startingArea.environment.trees) {
      expect(tree.biome).toBe(startingArea.biome.id);
      expect(startingArea.biome.groundMaterials).toContain(tree.groundMaterial);
      expect(tree.zoneTags).toContain('unknown-woods');
      for (const asset of getTreeAssets(tree)) {
        expect(asset.validBiomes).toContain(tree.biome);
        expect(asset.validGroundMaterials).toContain(tree.groundMaterial);
      }
    }
  });

  it('keeps tree collision tied to trunk data instead of canopy size', () => {
    for (const tree of startingArea.environment.trees) {
      const collision = startingArea.collision.find((obstacle) => obstacle.id === tree.id);

      expect(collision?.radius).toBe(tree.trunkCollisionRadius);
      expect(collision?.x).toBe(tree.x);
      expect(collision?.y).toBe(tree.y);
      expect(collision?.segmentEndY).toBe(tree.y + tree.trunkCollisionOffsetY);
      expect(tree.trunkCollisionOffsetY).toBeLessThan(0);
      expect(tree.trunkCollisionOffsetY).toBeLessThanOrEqual(-35);
      expect(tree.canopyRadiusX).toBeGreaterThan(tree.trunkCollisionRadius);
      expect(tree.canopyRadiusY).toBeGreaterThan(tree.trunkCollisionRadius);
    }
  });

  it('uses tree assets that preserve biome ground and expose canopy/collision roles', () => {
    for (const tree of startingArea.environment.trees) {
      const assets = getTreeAssets(tree);
      const assetTags = assets.flatMap((asset) => [...asset.tags]);

      for (const asset of assets) {
        expect(asset.hasBakedGround).toBe(false);
        expect(asset.tags).toContain('no-baked-ground');
        expect(asset.tags).toContain('upper-left-lit');
        expect(asset.lightProfile).toBe('upper-left-neutral');
      }
      expect(assetTags).toContain('trunk-collision');
      expect(assetTags).toContain('canopy-cover');
      if (tree.renderMode === 'assembled') {
        expect(assets.map((asset) => asset.role)).toEqual(['tree-root', 'tree-trunk', 'tree-canopy']);
      }
    }
  });

  it('keeps assembled trees as the active replacement path for zone one trees', () => {
    const assembledTrees = startingArea.environment.trees.filter((tree) => tree.renderMode === 'assembled');

    expect(assembledTrees).toHaveLength(startingArea.environment.trees.length);
    for (const tree of assembledTrees) {
      expect(tree.canopyOffsetY).toBeLessThan(-100);
      expect(tree.canopyRadiusX).toBeGreaterThan(tree.trunkCollisionRadius * 3);
    }
  });

  it('gives every tree an explicit placement role for future zone systems', () => {
    const roles = startingArea.environment.trees.map((tree) => tree.placementRole);

    expect(roles).toContain('shelter');
    expect(roles).toContain('boundary');
    expect(roles).toContain('threshold');
    expect(roles).toContain('wolf-cover');
    expect(roles).toContain('resource-parent');
    for (const tree of startingArea.environment.trees) {
      if (tree.zoneTags.includes('wolf-territory')) {
        expect(['wolf-cover', 'resource-parent']).toContain(tree.placementRole);
      }
      if (tree.placementRole === 'resource-parent') {
        expect(tree.zoneTags).toContain('wolf-territory');
      }
    }
  });
});
