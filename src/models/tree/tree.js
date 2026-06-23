import { Ash } from "../environment/ash";
import { SETTINGS, round } from "../../cfg/settings";
import { SEASONS, STATES } from "../../cfg/constants";
import { Cell } from "../cell";

export class Tree extends Cell {
  constructor(x, y, typeId) {
    super(x, y, typeId);
    this.nativeType = typeId;
    this.moisture = 0;
    this.age = 0;
    this.burnDuration = 0;
  }

  tick(env) {    

    if (this.state === STATES.FIRE) {
      this.burnDuration++;
      if(env.seasonIndex === SEASONS.WINTER && Math.random() < SETTINGS.CLIMATE.WINTER_SNOW_EXTINGUISH_CHANCE) {
        this.extinguish();
      }
      else if (this.burnDuration >= SETTINGS.FIRE.BURN_DURATION_TICKS) {
        env.replaceCell(new Ash(this.x, this.y))
      }
      return;
    }

    const fireNeighbors = env.neighbors.filter(n => n.getState() === STATES.FIRE);
    const fireNeighborsCount = fireNeighbors.length;
    const deadTreeNeighborsCount = env.neighbors.filter(n => n.getState() === STATES.DEAD).length;

    // высыхание от пожара
    if (fireNeighborsCount > 0) {
      const speed = this.getDryingSpeed(env.gMoisture);
      this.moisture = round(Math.max(0, this.moisture - fireNeighborsCount * speed), 2);
    } 
    
    // высыхание от сухостоя (только при экстремальной жаре)
    else if (deadTreeNeighborsCount > 0 && env.isExtremeDroughtActive) {
      
      // сухостой усиливает потерю влаги, но должен действовать слабее огня
      const baseSpeed = this.getDryingSpeed(env.gMoisture);
      const deadTreeFactor = deadTreeNeighborsCount * SETTINGS.MOISTURE.DEADTREE_FACTOR_MULTIPLIER;
      
      this.moisture = round(Math.max(0, this.moisture - baseSpeed * deadTreeFactor), 2);

    }
    else if (env.gMoisture < SETTINGS.MOISTURE.PASSIVE_DRYING_THRESHOLD) {
      // потеря влаги происходит с вероятностью, зависящей от типа дерева
      if(Math.random() < this.getDryingProbability(env.gMoisture)) {
        this.moisture = round(Math.max(0, this.moisture - SETTINGS.MOISTURE.PASSIVE_DRYING_RATE), 2);
      }
    }
    else {
      // выравнивание с климатом
      if (this.moisture < env.gMoisture) {
        this.moisture = round(Math.min(env.gMoisture, this.moisture + SETTINGS.MOISTURE.ABSORB_RATE), 2);
      } else if (this.moisture > env.gMoisture) {
        this.moisture = round(Math.max(env.gMoisture, this.moisture - SETTINGS.MOISTURE.EVAPORATE_RATE), 2);
      }
    }

    // логика воспламенения
    if (this.state !== STATES.FIRE) {
      this.processFire(fireNeighbors, deadTreeNeighborsCount, env.isExtremeDroughtActive, env.wind);
    }
  }

  processFire(fireNeighbors, deadTreeNeighborsCount, isExtremeDroughtActive, wind) {
    const baseFireChance = this.getBaseFireChance();
    const drynessFactor = this.getDrynessFactor() // чем суше дерево, тем выше вероятность воспламенения
    const spreadMult = SETTINGS.FIRE.SPREAD_MULTIPLIER;
    const deadTreeFactor = deadTreeNeighborsCount > 0 ? SETTINGS.FIRE.DEADTREE_MULTIPLIER : 1.0;
    
    // вероятность поспламенения (от случайного источника - "сухие грозы")
    const fireChance = drynessFactor * baseFireChance * deadTreeFactor * spreadMult;

    // флаг ориентированности клетки по направлению ветра
    let isWindAligned = false;

    // если не штиль (направление !== undefined)
    if(wind) {
      for (let neighbor of fireNeighbors) {

        const dX = this.x - neighbor.getX();
        const dY = this.y - neighbor.getY();

        // Если расположение соседнего дерева совпадает с направлением ветра относительно горящего
        if (dX === wind.dx && dY === wind.dy) { 

          if(!isWindAligned) {
            isWindAligned = true;
          }

          const chance = fireChance * SETTINGS.WIND_ROSE.MULTIPLIER;
          
          if (Math.random() < chance) {
              this.setFire();
              return;
          }
        }
      }
    }

    const hasFireNeighbors = fireNeighbors.length > 0;
    const isCriticalDry = this.moisture < SETTINGS.FIRE.CRITICAL_MOISTURE_THRESHOLD;

    if (hasFireNeighbors || (isExtremeDroughtActive && isCriticalDry)) {
      // если сейчас не штиль и клетка НЕ ориентирована по ветру  - урезаем базовую вероятность возгорания неориентированных по направлению ветра клеток
      // иначе используется базовый шанс
      if (Math.random() < (wind && !isWindAligned ? fireChance / SETTINGS.WIND_ROSE.MULTIPLIER : fireChance)) {
        this.setFire();
      }
    }
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

  setFire() {
    this.age = 0;
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

  getMoisture() {
    return this.moisture;
  }

  getAge() {
    return this.age;
  }
  
  setAge(value) {
    this.age = value;
  }

  assign(object) {
    this.moisture = object.moisture;
    this.age = object.age;
    this.burnDuration = object.burnDuration;
  }
}