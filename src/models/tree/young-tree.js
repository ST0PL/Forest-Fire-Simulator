import { SETTINGS } from '../../cfg/settings';
import { STATES } from '../../cfg/constants';
import { Tree } from './tree';
import { AdultTree } from './adult-tree';

export class YoungTree extends Tree {
  constructor(x, y) {
    super(x, y, STATES.YOUNG);
    this.moisture = SETTINGS.INIT.INITIAL_MOISTURE.YOUNG;
  }

  tick(env) {
    this.age++;
    if(SETTINGS.GROWTH.GROWTH_ENABLED) {
      if (this.age > SETTINGS.GROWTH.YOUNG_TO_ADULT_AGE) {
        const newTree = new AdultTree(this.x, this.y);
        newTree.assign(this);
        env.replaceCell(newTree);
        return;
      }
    }
    super.tick(env);
  }
  
  getDryingSpeed(globalMoisture) {
    const base = SETTINGS.MOISTURE.BASE_DRYING_FORMULA.A + 
                 SETTINGS.MOISTURE.YOUNG_DRYING_BASE_OFFSET;

    const coef = SETTINGS.MOISTURE.BASE_DRYING_FORMULA.B;
    const multiplier = SETTINGS.TREE_TYPES.YOUNG.DRYING_SPEED_MULTIPLIER;
    
    return (base - (globalMoisture * coef)) * multiplier;
  }

  getBaseFireChance() {
    return SETTINGS.TREE_TYPES.YOUNG.BASE_FIRE_CHANCE;
  }

  getDryingProbability(globalMoisture) {
    return SETTINGS.TREE_TYPES.YOUNG.DRYING_PROBABILITY;
  }
}
