import { Tree, YoungTree, AdultTree, OldTree, DeadTree, Statistic } from '../models'
import { ClimateController } from './climate-controller';
import { SETTINGS, getRandomInt, round } from '../cfg/settings';
import { SEASONS, STATES, CREATE_FUNCTIONS } from '../cfg/constants';

export class ForestController {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.tickCount = 0;
    this.climate = new ClimateController();
    this.cells = this.init();
    // стартовый очаг
    this.setRandomFire();
  }


  init() {
    const matrix = [];
    for (let y = 0; y < this.height; y++) {
      const row = [];
      for (let x = 0; x < this.width; x++) {
        const rand = Math.random();
        let cell;
        if (rand < SETTINGS.INIT.PROBABILITY.YOUNG_TREE) {
          cell = new YoungTree(x, y);
        } 
        else if (rand < SETTINGS.INIT.PROBABILITY.ADULT_TREE) {
          cell = new AdultTree(x, y);
        } 
        else if (rand < SETTINGS.INIT.PROBABILITY.OLD_TREE) {
          cell = new OldTree(x, y);
        } 
        else {
          // всё, что больше последнего порога - пустой участок
          cell = new Tree(x, y, STATES.EMPTY);
        }
        row.push(cell);
      }
      matrix.push(row);
    }
    return matrix;
  }

  getNeighbors(cell) {
    const neighbors = [];
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0)
           continue;
        let ny = cell.getY() + dy;
        let nx = cell.getX() + dx;
        if (ny >= 0 && ny < this.height && nx >= 0 && nx < this.width) {
          neighbors.push(this.cells[ny][nx]);
        }
      }
    }
    return neighbors;
  }

  tick() {
    this.tickCount++;
    this.climate.update(this.tickCount);
    const gMoisture = this.climate.getMoisture();
    const seasonIndex = this.climate.getSeasonIndex();
    
    //глубокое клонирование для двойной буферизации
    const nextCells = this.cells.map(row => row.map(cell => 
      Object.assign(Object.create(Object.getPrototypeOf(cell)), cell)
    ));

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const current = this.cells[y][x];
        const next = nextCells[y][x];

        // рост деревьев

        if(SETTINGS.GROWTH.GROWTH_ENABLED) {
            if (next.getState() === STATES.YOUNG && next.getAge() > SETTINGS.GROWTH.YOUNG_TO_ADULT_AGE) {
              const newTree = new AdultTree(x, y);
              newTree.assign(next);
              nextCells[y][x] = newTree;
              continue;
            }

            else if (next.getState() === STATES.ADULT && next.getAge() > SETTINGS.GROWTH.ADULT_TO_OLD_AGE) {
              const newTree = new OldTree(x, y);
              newTree.assign(next);
              nextCells[y][x] = newTree;
              continue;
            }
          }
            
        // логика горения
        // зимой снег может заранее потушить огонь
        if (seasonIndex === SEASONS.WINTER && current.getState() === STATES.FIRE && 
          Math.random() < SETTINGS.CLIMATE.WINTER_SNOW_EXTINGUISH_CHANCE) {
            next.setAsh();
            continue;
        }

        if (current.getState() === STATES.FIRE) {
          next.incBurnDuration();
          if (next.getBurnDuration() >= SETTINGS.FIRE.BURN_DURATION_TICKS) {
            next.setAsh()
          }
          continue;
        }

        // логика пустых/сгоревших участков (регенерация (превращение в пустой участок) с таймером и появление новых деревьев)
        if (SETTINGS.REGENERATION.REGENERATION_ENABLED) {
          if(current.getState() === STATES.ASH) {
            // инкремент таймера восстановления
            if(Math.random() < SETTINGS.REGENERATION.RECOVERY_TICK_CHANCE[seasonIndex] && next.getRecoveryTicks() < SETTINGS.REGENERATION.MIN_RECOVERY_TIME) {
              next.incRecoveryTicks();
            }
            
            // регенерация возможна только после прохождения минимального времени восстановления
            if (next.getRecoveryTicks() >= SETTINGS.REGENERATION.MIN_RECOVERY_TIME) {
              nextCells[y][x] = new Tree(x, y, STATES.EMPTY);
            }
            continue;
          }

          // появление новых деревьев
          else if (current.getState() === STATES.EMPTY) {
            const seasonMultiplier = SETTINGS.REGENERATION.SEASON_MULTIPLIERS[seasonIndex];
            const appearanceChance = SETTINGS.REGENERATION.BASE_CHANCE_PER_TICK * seasonMultiplier;
            
            if (Math.random() < appearanceChance) {
              nextCells[y][x] = new YoungTree(x, y);
              continue;
            }
          }
        }
        
        const neighbors = this.getNeighbors(current);
        const fireNeighbors = neighbors.filter(n => n.getState() === STATES.FIRE);
        const fireNeighborsCount = fireNeighbors.length;
        const deadTreeNeighborsCount = neighbors.filter(n => n.getState() === STATES.DEAD).length;

        // логика живых деревьев
      
        if (current.getState() >= STATES.YOUNG && current.getState() <= STATES.OLD) {
          next.incAge();
          
          // логика высыхания

          // высыхание от пожара
          if (fireNeighborsCount > 0) {
            const speed = current.getDryingSpeed(gMoisture);
            next.setMoisture(round(Math.max(0, current.getMoisture() - fireNeighborsCount * speed), 2));
          } 
          
          // высыхание от сухостоя (только при экстремальной жаре)
          else if (deadTreeNeighborsCount > 0 && this.climate.isExtremeDroughtActive()) {
            
            // сухостой усиливает потерю влаги, но должен действовать слабее огня
            const baseSpeed = current.getDryingSpeed(gMoisture);
            const deadTreeFactor = deadTreeNeighborsCount * SETTINGS.MOISTURE.DEADTREE_FACTOR_MULTIPLIER;
            
            next.setMoisture(round(Math.max(0, current.getMoisture() - baseSpeed * deadTreeFactor), 2));

          }
          else if (gMoisture < SETTINGS.MOISTURE.PASSIVE_DRYING_THRESHOLD) {
            // потеря влаги происходит с вероятностью, зависящей от типа дерева
            if(Math.random() < current.getDryingProbability(gMoisture)) {
              next.setMoisture(round(Math.max(0, current.getMoisture() - SETTINGS.MOISTURE.PASSIVE_DRYING_RATE), 2));
            }
          }
          else {
            // выравнивание с климатом
            if (current.getMoisture() < gMoisture) {
              next.setMoisture(round(Math.min(gMoisture, current.getMoisture() + SETTINGS.MOISTURE.ABSORB_RATE), 2));
            } else if (current.getMoisture() > gMoisture) {
              next.setMoisture(round(Math.max(gMoisture, current.getMoisture() - SETTINGS.MOISTURE.EVAPORATE_RATE), 2));
            }
          }

          // логика сухостоя
          if (current.getState() === STATES.OLD && this.climate.isExtremeDroughtActive()) {
              // при экстремальной жаре дерево блокирует потерю влаги (защитный механизм)
              // но накапливает "стресс" (углеродное голодание / эмболия)

              if(Math.random() < SETTINGS.OLD_TREE.STRESS_CHANCE) {
                  next.setStress(round(next.getStress() + SETTINGS.OLD_TREE.STRESS_ACCUMULATION_RATE, 2));
              }
              
              // проверка на превращение в сухостой
              if ((next.getStress() >= SETTINGS.OLD_TREE.HEAT_STRESS_THRESHOLD)) {
                this.setDead(x, y, next.getAge(), nextCells)
                continue;
              }
          } 
          else if (current.getState() === STATES.OLD) {
              // если жара закончилась, то постепенно сбрасываем стресс (дерево восстанавливается)
              if (next.getStress() > 0) {
                next.setStress(Math.max(0, round(next.getStress() - SETTINGS.OLD_TREE.STRESS_EVAPORATE_RATE, 2)));
              }
          }
        }
        // логика воспламенения
        if([STATES.EMPTY, STATES.FIRE, STATES.ASH].includes(next.getState())) {
          continue;
        }

        this.processFire(next, fireNeighbors, deadTreeNeighborsCount);
      }
    }
    
    this.cells = nextCells;
    return this.cells;
  }

  // обработка логики пожара (вынесено в отдельную функцию для разделения потока логик воспламенения от ветра и от жары)
  processFire(cell, fireNeighbors, deadTreeNeighborsCount) {

    const baseFireChance = cell.getBaseFireChance();
    const drynessFactor = cell.getDrynessFactor() // чем суше дерево, тем выше вероятность воспламенения
    const spreadMult = SETTINGS.FIRE.SPREAD_MULTIPLIER;
    const deadTreeFactor = deadTreeNeighborsCount > 0 ? SETTINGS.FIRE.DEADTREE_MULTIPLIER : 1.0;
    
    // вероятность поспламенения (от случайного источника - "сухие грозы")
    const fireChance = drynessFactor * baseFireChance * deadTreeFactor * spreadMult;
    const wind = SETTINGS.WIND_ROSE.DIRECTIONS[this.climate.getWindController().getDirection()];

    // флаг ориентированности клетки по направлению ветра
    let isWindAligned = false;

    // если не штиль (направление !== undefined)
    if(wind) {
      for (let neighbor of fireNeighbors) {

        const dX = cell.getX() - neighbor.getX();
        const dY = cell.getY() - neighbor.getY();

        // Если расположение соседнего дерева совпадает с направлением ветра относительно горящего
        if (dX === wind.dx && dY === wind.dy) { 

          if(!isWindAligned) {
            isWindAligned = true;
          }

          const chance = fireChance * SETTINGS.WIND_ROSE.MULTIPLIER;
          
          if (Math.random() < chance) {
              cell.setFire();
              return;
          }
        }
      }
    }

    const hasFireNeighbors = fireNeighbors.length > 0;
    const isCriticalDry = cell.getMoisture() < SETTINGS.FIRE.CRITICAL_MOISTURE_THRESHOLD;
    const isExtremeDrought = this.climate.isExtremeDroughtActive();

    if (hasFireNeighbors || (isExtremeDrought && isCriticalDry)) {
      // если сейчас не штиль и клетка НЕ ориентирована по ветру  - урезаем базовую вероятность возгорания неориентированных по направлению ветра клеток
      // иначе используется базовый шанс
      if (Math.random() < (wind && !isWindAligned ? fireChance / SETTINGS.WIND_ROSE.MULTIPLIER : fireChance)) {
        cell.setFire();
      }
    }
  }

  // интерфейс для поджога дерева
  setFire(x, y) {
    this.cells[y][x].setFire();
  }

  // интерфейс для поджога случайного дерева
  setRandomFire() {
    this.setFire(getRandomInt(0, this.width), getRandomInt(0, this.height));
  }

  // интерфейс для превращения дерева в сухостой
  
  setDead(x, y, prevAge, grid) {
    let deadTree = new DeadTree(x, y);
    if(prevAge) {
      deadTree.setAge(prevAge);
    }

    if(grid) {
      grid[y][x] = deadTree
    }
    else {
      this.cells[y][x] = deadTree;
    }
  }

  // интерфейс для создания / удаления деревьев
  createCell(x, y, state) {
    this.cells[y][x] = CREATE_FUNCTIONS[state](x, y)
  }

  // интерфейс для тушения деревьев
  extinguishTree(x, y) {
    this.cells[y][x].extinguish();
  }

  getStats() {
    let young = 0, adult = 0, old = 0, dead = 0, fire = 0, ash = 0, totalMoisture = 0, totalTrees = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const c = this.cells[y][x];
        const state = c.getState();
        if (state >= STATES.YOUNG && state <= STATES.FIRE){
          totalTrees++;
          totalMoisture += c.getMoisture();
        }
        switch(state) {
          case STATES.YOUNG:
            young++;
            break;
          case STATES.ADULT:
            adult++;
            break;
          case STATES.OLD:
            old++;
            break;
          case STATES.FIRE:
            fire++;
            break;
          case STATES.ASH:
            ash++;
            break;
          case STATES.DEAD:
            dead++;
            break;
        }
      }
    }
    return new Statistic(young, adult, old, dead, fire, ash, totalTrees > 0 ? Math.round(totalMoisture / totalTrees) : 0);
  }

  getClimate() {
    return this.climate;
  }
  
  getCells() {
    return this.cells;
  }

  getTicks() {
    return this.tickCount;
  }

  // удаление всех деревьев с поля (превращение в пусте клетки)
  
  setEmpty() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x] = new Tree(x, y, STATES.EMPTY);
      }
    }
  }

  // создание объекта на основе полей модели (т.к. функции при сериализации не сохраняются)
  static createFromObject(object) {
    const forestController = new ForestController(object.width, object.height);
    forestController.tickCount = object.tickCount;
    forestController.climate = ClimateController.createFromObject(object.climate);
    // восстановление классов клеток матрицы через вложенный map и таблицу функций
    forestController.cells = object.cells.map(cells => cells.map(cell => Object.assign(CREATE_FUNCTIONS[cell.getNativeType()](cell.getX(), cell.getY()), cell)))
    return forestController;
  }
}