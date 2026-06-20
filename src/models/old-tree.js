import { Tree } from './tree';
import { SETTINGS } from '../cfg/settings'
import { STATES } from '../cfg/constants';

export class OldTree extends Tree {
  constructor(x, y) {
    super(x, y, STATES.OLD);
    this.moisture = SETTINGS.INIT.INITIAL_MOISTURE.OLD
    this.age = SETTINGS.GROWTH.ADULT_TO_OLD_AGE
  }

  getDryingSpeed(globalMoisture) {
    const base = SETTINGS.MOISTURE.BASE_DRYING_FORMULA.A;
    const coef = SETTINGS.MOISTURE.BASE_DRYING_FORMULA.B;
    const multiplier = SETTINGS.TREE_TYPES.OLD.DRYING_SPEED_MULTIPLIER;
    
    return (base - (globalMoisture * coef)) * multiplier;
  }

  getBaseFireChance() {
    return SETTINGS.TREE_TYPES.OLD.BASE_FIRE_CHANCE;
  }

  getDryingProbability(globalMoisture) {
    // вековые деревья блокируют устьица, пассивная потеря влаги = 0
    if (globalMoisture <= SETTINGS.MOISTURE.EXTREME_DROUGHT_THRESHOLD) {
      return 0;
    }
    return SETTINGS.TREE_TYPES.OLD.DRYING_PROBABILITY;
  }
}