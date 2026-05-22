export type CharacterBodyStageId = 'starter-child' | 'adolescent-survivor';

export type CharacterBodyCondition = 'cold' | 'warm';

export type CharacterSocketSetId = 'starter-child-v1';

export type CharacterAnimationPackId = 'starter-child-cold-v1' | 'starter-child-warm-v1';

export type CharacterActionPose =
  | 'idle'
  | 'walk'
  | 'gather'
  | 'fire-kneel'
  | 'attack-bare'
  | 'attack-main-hand'
  | 'dodge-roll'
  | 'hurt'
  | 'collapse'
  | 'use-item';

export type CharacterModelState = {
  bodyStage: CharacterBodyStageId;
  condition: CharacterBodyCondition;
  socketSet: CharacterSocketSetId;
  animationPackId: CharacterAnimationPackId;
  scaleTier: 'child-small' | 'adolescent-medium';
  designIntent: string;
};

export const createStarterCharacterModelState = (
  condition: CharacterBodyCondition = 'cold'
): CharacterModelState => ({
  bodyStage: 'starter-child',
  condition,
  socketSet: 'starter-child-v1',
  animationPackId: condition === 'cold' ? 'starter-child-cold-v1' : 'starter-child-warm-v1',
  scaleTier: 'child-small',
  designIntent:
    'The first body model is a small vulnerable child; generated equipment must fit this body stage and socket set.'
});

export const withCharacterCondition = (
  model: CharacterModelState,
  condition: CharacterBodyCondition
): CharacterModelState => ({
  ...model,
  condition,
  animationPackId: condition === 'cold' ? 'starter-child-cold-v1' : 'starter-child-warm-v1'
});
