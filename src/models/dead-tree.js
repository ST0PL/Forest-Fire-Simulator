import { Tree } from './tree';
import { SETTINGS } from '../cfg/settings';
import { STATES } from '../cfg/constants';

export class DeadTree extends Tree {
  constructor(x, y) {
    super(x, y, STATES.DEAD);
  }

  getBaseFireChance() {
    return SETTINGS.TREE_TYPES.DEAD.BASE_FIRE_CHANCE;
  }

  getDryingSpeed(globalMoisture) {
    const base = SETTINGS.MOISTURE.BASE_DRYING_FORMULA.A;
    const coef = SETTINGS.MOISTURE.BASE_DRYING_FORMULA.B;
    const multiplier = SETTINGS.TREE_TYPES.DEAD.DRYING_SPEED_MULTIPLIER;
    
    return (base - (globalMoisture * coef)) * multiplier;
  }

  getDryingProbability(globalMoisture) {
    return SETTINGS.TREE_TYPES.DEAD.DRYING_PROBABILITY;
  }
}