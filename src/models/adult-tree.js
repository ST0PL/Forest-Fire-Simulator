import { Tree } from './tree';
import { SETTINGS } from '../cfg/settings';
import { STATES } from '../cfg/constants';

export class AdultTree extends Tree {
  constructor(x, y) {
    super(x, y, STATES.ADULT);
    this.moisture = SETTINGS.INIT.INITIAL_MOISTURE.ADULT;
    this.age = SETTINGS.GROWTH.YOUNG_TO_ADULT_AGE;
  }

  getDryingSpeed(globalMoisture) {
    const base = SETTINGS.MOISTURE.BASE_DRYING_FORMULA.A;
    const coef = SETTINGS.MOISTURE.BASE_DRYING_FORMULA.B;
    const mult = SETTINGS.TREE_TYPES.ADULT.DRYING_SPEED_MULTIPLIER;
    return (base - (globalMoisture * coef)) * mult;
  }

  getBaseFireChance() {
    return SETTINGS.TREE_TYPES.ADULT.BASE_FIRE_CHANCE;
  }

  getDryingProbability(globalMoisture) {
    return SETTINGS.TREE_TYPES.ADULT.DRYING_PROBABILITY;
  }
}