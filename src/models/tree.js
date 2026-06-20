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

  getBaseFireChance() {
    throw new Error("Необходима реализация в производном классе.");
  }

  getDryingSpeed(globalMoisture) {
    throw new Error("Необходима реализация в производном классе.");
  }

  getDryingProbability(globalMoisture) {
    throw new Error("Необходима реализация в производном классе.");
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  setFire() {
    this.age = 0;
    this.stress = 0;
    this.moisture = 0;
    this.burnDuration = 0;
    this.state = STATES.FIRE;
  }

  setAsh() {
    this.age = 0;
    this.stress = 0;
    this.moisture = 0;
    this.burnDuration = 0;
    this.state = STATES.ASH;   
  }

  extinguish() {
    this.burnDuration = 0;
    this.state = this.nativeType;  
  }

  getDrynessFactor(){
    return (100 - this.moisture) / 100;
  }

  getState() {
    return this.state;
  }

  getMoisture() {
    return this.moisture;
  }
  
  setMoisture(value) {
    this.moisture = value;
  }

  getAge() {
    return this.age;
  }
  
  setAge(value) {
    this.age = value;
  }

  getBurnDuration() {
    return this.burnDuration;
  }

  getRecoveryTicks() {
    return this.recoveryTicks;
  }

  getStress() {
    return this.stress;
  }

  setStress(value) {
    this.stress = value;
  }

  assign(object) {
    this.moisture = object.moisture;
    this.age = object.age;
    this.burnDuration = object.burnDuration;
    this.recoveryTicks = object.recoveryTicks;;
  }

  incAge() {
    this.age++;
  }

  incBurnDuration() {
    this.burnDuration++;
  }

  incRecoveryTicks() {
    this.recoveryTicks++;
  }
}