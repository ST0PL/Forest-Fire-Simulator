import { SETTINGS } from '../../cfg/settings';
import { STATES } from '../../cfg/constants';
import { Tree } from './tree';
import { OldTree } from './old-tree';

export class AdultTree extends Tree {
  constructor(x, y) {
    super(x, y, STATES.ADULT);
    this.moisture = SETTINGS.INIT.INITIAL_MOISTURE.ADULT;
    this.age = SETTINGS.GROWTH.YOUNG_TO_ADULT_AGE;
  }

  tick(env) {
    this.age++;
    if(this.age > SETTINGS.GROWTH.ADULT_TO_OLD_AGE) { 
      const newTree = new OldTree(this.x, this.y);
      newTree.assign(this);
      env.replaceCell(newTree);
      return;
    }
    super.tick(env);
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