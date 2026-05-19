export type Direction = 'north' | 'south' | 'west' | 'east';

export type ActionState = {
  moveX: number;
  moveY: number;
  attack: boolean;
  dodge: boolean;
  gather: boolean;
  craft: boolean;
  useFood: boolean;
  restart: boolean;
  pause: boolean;
};

export const idleActions = (): ActionState => ({
  moveX: 0,
  moveY: 0,
  attack: false,
  dodge: false,
  gather: false,
  craft: false,
  useFood: false,
  restart: false,
  pause: false
});
