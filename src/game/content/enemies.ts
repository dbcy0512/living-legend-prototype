import { assetKeys } from '../assets/manifest';

export type EnemyKind = 'mire-spider' | 'violet-moss-blob' | 'thorn-shell-mite';
export type EnemyEncounterRole = 'skitter' | 'pressure' | 'blocker';
export type EnemyHabitatTag = 'damp-shade' | 'deadwood' | 'animal-trail' | 'dense-forest-edge';

export type EnemyDefinition = {
  kind: EnemyKind;
  label: string;
  assetKey: string;
  maxHealth: number;
  contactDamage: number;
  movementSpeed: number;
  encounterRole: EnemyEncounterRole;
  habitatTags: readonly EnemyHabitatTag[];
  firstEncounterUse: string;
  home: {
    x: number;
    y: number;
  };
};

const enemyDefinitions = {
  'mire-spider': {
    kind: 'mire-spider',
    label: 'Mire Spider',
    assetKey: assetKeys.enemyMireSpider,
    maxHealth: 24,
    contactDamage: 8,
    movementSpeed: 62,
    encounterRole: 'skitter',
    habitatTags: ['damp-shade', 'deadwood'],
    firstEncounterUse: 'A small fast creature for teaching spacing, fear, and movement without the inevitability of a wolf.',
    home: {
      x: 1010,
      y: 620
    }
  },
  'violet-moss-blob': {
    kind: 'violet-moss-blob',
    label: 'Violet Moss Blob',
    assetKey: assetKeys.enemyVioletMossBlob,
    maxHealth: 30,
    contactDamage: 10,
    movementSpeed: 38,
    encounterRole: 'pressure',
    habitatTags: ['damp-shade', 'dense-forest-edge'],
    firstEncounterUse: 'A slow pressure enemy for testing readable approach, knockback, and fire attraction.',
    home: {
      x: 1180,
      y: 540
    }
  },
  'thorn-shell-mite': {
    kind: 'thorn-shell-mite',
    label: 'Thorn-Shell Mite',
    assetKey: assetKeys.enemyThornShellMite,
    maxHealth: 28,
    contactDamage: 9,
    movementSpeed: 48,
    encounterRole: 'blocker',
    habitatTags: ['animal-trail', 'deadwood'],
    firstEncounterUse: 'A small armored nuisance that can guard paths or resource pockets without feeling like a predator.',
    home: {
      x: 1268,
      y: 670
    }
  }
} as const satisfies Record<EnemyKind, EnemyDefinition>;

export const getEnemyDefinition = (kind: EnemyKind): EnemyDefinition => enemyDefinitions[kind];

export const getEnemyDefinitions = (): readonly EnemyDefinition[] => Object.values(enemyDefinitions);

