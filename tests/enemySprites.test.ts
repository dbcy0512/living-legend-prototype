import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { getEnemyDefinitions } from '../src/game/content/enemies';

const enemySpriteFiles = [
  {
    kind: 'mire-spider',
    file: 'mire-spider-v2.png',
    width: 96,
    height: 96
  },
  {
    kind: 'violet-moss-blob',
    file: 'violet-moss-blob-v2.png',
    width: 96,
    height: 96
  },
  {
    kind: 'thorn-shell-mite',
    file: 'thorn-shell-mite-v2.png',
    width: 96,
    height: 96
  }
] as const;

describe('generated zone one enemy sprites', () => {
  it('keeps the PixelLab first-encounter enemy sprites present and linked to definitions', () => {
    const definitions = getEnemyDefinitions();

    for (const sprite of enemySpriteFiles) {
      const path = join(process.cwd(), 'public', 'assets', 'enemies', sprite.file);
      const definition = definitions.find((candidate) => candidate.kind === sprite.kind);

      expect(definition).toBeDefined();
      expect(definition?.assetKey).toContain('enemy:');
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
