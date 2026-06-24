import { SETTINGS } from '../../cfg/settings';
import { STATES, SEASONS } from '../../cfg/constants';
import { Tree } from './tree';
import { Ash } from '../environment/ash';

export class DeadTree extends Tree {
  constructor(x, y) {
    super(x, y, STATES.DEAD);
  }

    tick(env) {
    // логика горения (как у обычного дерева)
    if (this.state === STATES.FIRE) {
      this.burnDuration++;
      // осадки могут потушить пожар
      if(Math.random() < SETTINGS.CLIMATE.WEATHER.EXTINGUISH_CHANCES[env.weather]) {
        this.extinguish();
      }
      else if (this.burnDuration >= SETTINGS.FIRE.BURN_DURATION_TICKS) {
        env.replaceCell(new Ash(this.x, this.y))
      }
      return;
    }

    // сухостой НЕ меняет влажность, но обрабатывает воспламенение
    const fireNeighbors = env.neighbors.filter(n => n.getState() === STATES.FIRE);
    const deadTreeNeighborsCount = env.neighbors.filter(n => n.getState() === STATES.DEAD).length;

    // влажность всегда 0, поэтому высыхание не применяется
    // но логика воспламенения должна работать

    if (this.state !== STATES.FIRE) {
      this.processFire(fireNeighbors, deadTreeNeighborsCount, env.wind, env.weather, env.isExtremeDrought);
    }
  }

  getBaseFireChance() {
    return SETTINGS.TREE_TYPES.DEAD.BASE_FIRE_CHANCE;
  }

  getDryingSpeed(globalMoisture) {    
    return 0;
  }

  getDryingProbability(globalMoisture) {
    return 0;
  }
}