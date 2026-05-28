import { STATES } from "../cfg/constants";
import { SETTINGS } from "../cfg/settings";

export class Tree {
  constructor(x, y, typeId) {
    this.x = x;
    this.y = y;
    this.nativeType = typeId;
    this.state = typeId;
    this.moisture = 0;
    this.age = 0;
    this.burnDuration = 0;
    this.recoveryTicks = 0;
    this.stress = 0;
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

  setFire() {
    this.age = 0;
    this.stress = 0;
    this.moisture = 0;
    this.burnDuration = 0;
    this.state = STATES.FIRE;
  }

  extinguish() {
    this.burnDuration = 0;
    this.state = this.nativeType;  
  }

  getDrynessFactor(){
    return (100 - this.moisture) / 100;
  }
}