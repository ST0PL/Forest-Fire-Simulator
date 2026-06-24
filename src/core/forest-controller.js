import { SETTINGS, getRandomInt } from '../cfg/settings';
import { ClimateController } from './climate-controller';
import { Tree, YoungTree, AdultTree, OldTree, DeadTree, Statistic, Empty, Water } from '../models'
import { STATES, CREATE_FUNCTIONS } from '../cfg/constants';

export class ForestController {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.tickCount = 0;
    this.climate = new ClimateController();
    this.cells = this.init();
    this.nextCells = [];
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
          cell = new Empty(x, y);
        }
        row.push(cell);
      }
      matrix.push(row);
    }
    this.generateWaterChannels(matrix);
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
    
    //глубокое клонирование для двойной буферизации (решение проблемы состояния гонки)
    this.nextCells = this.cells.map(row => row.map(cell => 
      Object.assign(Object.create(Object.getPrototypeOf(cell)), cell)
    ));

    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const current = this.nextCells[y][x];
        const env = {
          seasonIndex: this.climate.getSeasonIndex(),
          gMoisture:  this.climate.getMoisture(),
          isExtremeDrought: this.climate.isExtremeDrought(),
          wind: SETTINGS.WIND_ROSE.DIRECTIONS[this.climate.getWindController().getDirection()],
          weather: this.climate.getWeatherController().getWeather(),
          neighbors: this.getNeighbors(current),
          replaceCell: (cell) => this.replaceCell(cell),
          createCell: (x, y, state) => this.createCell(x, y, state)
        }
        current.tick(env);
      }
    }
    
    this.cells = this.nextCells;
    return this.cells;
  }

  // интерфейс для мутирования состояния объектов поля в рамках основного цикла симуляции
  replaceCell(cell) {
    this.nextCells[cell.getY()][cell.getX()] = cell;
  }

  // интерфейс для создания / удаления клеток в рамках основного цикла симуляции
  createCell(x, y, state) {
    this.nextCells[y][x] = CREATE_FUNCTIONS[state](x, y)
  }

  // интерфейс для создания / удаления клеток вне цикла симуляции
  createCellGlobal(x, y, state) {
    this.cells[y][x] = CREATE_FUNCTIONS[state](x, y)
  }


  // интерфейс для поджога дерева вне цикла симуляции
  setFire(x, y) {
    this.cells[y][x].setFire();
  }

  // интерфейс для поджога случайного дерева вне цикла симуляции

  setRandomFire() {
    const trees = this.cells.flat().filter(cell => cell instanceof Tree);
    if (trees.length > 0) {
      trees[getRandomInt(0, trees.length)].setFire();
    }
  }

  // интерфейс для превращения дерева в сухостой вне цикла симуляции
  setDead(x, y, prevAge) {
    const deadTree = new DeadTree(x, y);
    deadTree.setAge(prevAge);
    this.cells[y][x] = deadTree;
  }

  // интерфейс для тушения деревьев вне цикла симуляции
  extinguishTree(x, y) {
    this.cells[y][x].extinguish();
  }

  getStats() {
    let young = 0, adult = 0, old = 0, dead = 0, fire = 0, ash = 0, totalMoisture = 0, totalTrees = 0;
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const cell = this.cells[y][x];
        const state = cell.getState();
        if (state >= STATES.YOUNG && state < STATES.FIRE){
          totalTrees++;
          totalMoisture += cell.getMoisture();
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

  // удаление всех деревьев с поля (превращение в пустые клетки)
  
  setEmpty() {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.cells[y][x] = new Empty(x, y);
      }
    }
  }


  generateWaterChannels(matrix) {
    if(SETTINGS.WATER_CHANNELS.COUNT_THRESHOLD === 0) return;

    const count = getRandomInt(1, SETTINGS.WATER_CHANNELS.COUNT_THRESHOLD);

    for(let i = 0; i < count; i++) {
      const x = getRandomInt(1, SETTINGS.FIELD.WIDTH);
      const y = getRandomInt(1, SETTINGS.FIELD.HEIGHT);
      const meander = getRandomInt(1, SETTINGS.WATER_CHANNELS.MEANDERS_THRESHOLD);

      this.generateWaterChannel(matrix, x, y, meander);
    }
  }

  generateWaterChannel(matrix, x, y, meander) {
    if(meander <= 0)
      return;
    
    const directions = SETTINGS.WATER_CHANNELS.DIRECTIONS;

    for(let i = 0; i < meander; i++) {
      
      const segmentLen = getRandomInt(1, SETTINGS.WATER_CHANNELS.SEGMENT_THRESHOLD);
      const direction = directions[getRandomInt(0, directions.length)];
      
      for(let j = 0; j < segmentLen; j++) {
        if(x >= SETTINGS.FIELD.WIDTH || y >= SETTINGS.FIELD.HEIGHT  || x < 0 || y < 0) {
          return;
        }

        matrix[y][x] = new Water(x, y);
        y += direction.dy;
        x += direction.dx;
      }
    }
  }

  // создание объекта на основе полей модели (т.к. функции при сериализации не сохраняются)
  static createFromObject(object) {
    const forestController = new ForestController(object.width, object.height);
    forestController.tickCount = object.tickCount;
    forestController.climate = ClimateController.createFromObject(object.climate);
    forestController.cells = object.cells.map(cells => cells.map(cell => Object.assign(CREATE_FUNCTIONS[cell.nativeType ?? cell.state](cell.x, cell.y), cell)))
    return forestController;
  }
}