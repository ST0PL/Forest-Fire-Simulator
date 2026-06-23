import { round, SETTINGS } from '../../cfg/settings'
import { STATES } from '../../cfg/constants';
import { Tree } from './tree';
import { DeadTree } from './dead-tree';

export class OldTree extends Tree {
  constructor(x, y) {
    super(x, y, STATES.OLD);
    this.moisture = SETTINGS.INIT.INITIAL_MOISTURE.OLD;
    this.age = SETTINGS.GROWTH.ADULT_TO_OLD_AGE;
    this.stress = 0;
  }

  tick(env) {
    this.age++;
    // логика сухостоя

    if (env.isExtremeDroughtActive) {

        // при экстремальной жаре дерево блокирует потерю влаги (защитный механизм)
        // но накапливает "стресс" (углеродное голодание / эмболия)

        if(Math.random() < SETTINGS.OLD_TREE.STRESS_CHANCE) {
            this.stress = round(this.stress + SETTINGS.OLD_TREE.STRESS_ACCUMULATION_RATE, 2);
        }
        
        // проверка на превращение в сухостой
        if (this.stress >= SETTINGS.OLD_TREE.HEAT_STRESS_THRESHOLD) {
          const deadTree = new DeadTree(this.x, this.y);
          deadTree.age = this.age;
          env.replaceCell(deadTree);
          return;
        }
    } 
    // если жара закончилась, то постепенно сбрасываем стресс (дерево восстанавливается)
   else if (this.stress > 0) {
      this.stress = Math.max(0, round(this.stress - SETTINGS.OLD_TREE.STRESS_EVAPORATE_RATE, 2));
    }
    super.tick(env);
  }

  setFire() {
    this.stress = 0;
    super.setFire();
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

  getStress() {
    return this.stress;
  }

  setStress(value) {
    this.stress = value;
  }
}