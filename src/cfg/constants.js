import { AdultTree, DeadTree, Empty, OldTree, Tree, Ash, Water, YoungTree } from "../models";

export const SEASONS = {
  SPRING: 0,
  SUMMER: 1,
  AUTUMN: 2,
  WINTER: 3
}
export const STATES = {
  EMPTY: 0,
  YOUNG: 1,
  ADULT: 2,
  OLD: 3,
  DEAD: 4,
  FIRE: 5,
  ASH: 6,
  LIGHTNING: 7,
  WATER: 8,
  ICE: 9
}

export const WIND_DIRECTIONS = {
  N: 0,
  S: 1,
  W: 2,
  E: 3,
  NW: 4,
  NE: 5,
  SW: 6,
  SE: 7,
  C: 8
}

export const WEATHER = {
  CLEAR: 0,
  RAINY: 1,
  STORMY: 2
}

export const WIND_DIRECTION_NAMES = {
  [WIND_DIRECTIONS.N]: 'Северный ↓',
  [WIND_DIRECTIONS.S]: 'Южный ↑',
  [WIND_DIRECTIONS.W]: 'Западный →',
  [WIND_DIRECTIONS.E]: 'Восточный ←',
  [WIND_DIRECTIONS.NW]: 'Северо-западный ↘',
  [WIND_DIRECTIONS.NE]: 'Северо-восточный ↙',
  [WIND_DIRECTIONS.SW]: 'Юго-западный ↗',
  [WIND_DIRECTIONS.SE]: 'Юго-восточный ↖',
  [WIND_DIRECTIONS.C]: 'Штиль',
}

export const WEATHER_NAMES = {
  [WEATHER.CLEAR]: "Ясно ☀️",
  [WEATHER.RAINY]: ["Дождь 🌧️", "Снегопад ❄️"],
  [WEATHER.STORMY]: ["Гроза ⛈️", "Ливневый снегопад 🌨"]
}

export const COLORS = {
  [STATES.EMPTY]: '#262626', // пустой участок
  [STATES.YOUNG]: '#81c784', // молодое дерево
  [STATES.ADULT]: '#2e7d32', // зрелое дерево
  [STATES.OLD]: '#1b5e20', // старое дерево
  [STATES.DEAD]: '#5d4037', // сухостой
  [STATES.FIRE]: '#d84315', // очаг возгорания
  [STATES.ASH]: '#757575', // выжженный участок
  [STATES.LIGHTNING]: '#b388ff', // удал молнией
  [STATES.WATER]: '#5078f1', // водоём
  [STATES.ICE]: '#6da0ff', // лёд
};

export const SEASON_NAMES = {
  [SEASONS.SPRING]: 'Весна 🌸',
  [SEASONS.SUMMER]: 'Лето ☀️',
  [SEASONS.AUTUMN]: 'Осень 🍂',
  [SEASONS.WINTER]: 'Зима ❄️'
}

export const STATE_NAMES = {
  [STATES.EMPTY]: 'Пустой участок',
  [STATES.YOUNG]: 'Молодое дерево',
  [STATES.ADULT]: 'Зрелое дерево',
  [STATES.OLD]: 'Старое дерево',
  [STATES.DEAD]: 'Сухостой',
  [STATES.FIRE]: 'Очаг возгорания',
  [STATES.ASH]: 'Выжженный участок',
  [STATES.LIGHTNING]: 'Молния',
  [STATES.WATER]: 'Водоём',
  [STATES.ICE]: 'Лёд',
};

// набор функций для создания объектов деревьев после десериализации клеток
export const CREATE_FUNCTIONS = {
  [STATES.EMPTY]: (x, y) => new Empty(x, y),
  [STATES.YOUNG]: (x, y) => new YoungTree(x, y),
  [STATES.ADULT]: (x, y) => new AdultTree(x, y),
  [STATES.OLD]: (x, y) => new OldTree(x, y),
  [STATES.DEAD]: (x, y) => new DeadTree(x, y),
  [STATES.ASH]: (x, y) => new Ash(x, y),
  [STATES.WATER]: (x, y) => new Water(x, y),
  [STATES.ICE]: (x, y) => new Water(x, y),
}

export const UI_COLORS = {
  BACKGROUND: '#121212',
  PANEL_BG: '#1e1e1e',
  BORDER_SPRING: '#00ffff',
  BORDER_SUMMER: '#bb86fc',
  BORDER_AUTUMN: '#ffb74d',
  TEXT_MOISTURE: '#4caf50',
  BTN_STEP: '#2b3849',
  BTN_START: '#2b3849',
  BTN_PAUSE: '#2b3849',
  BTN_RESET: '#2b3849',
  BTN_CLEAR: '#2b3849',
  BTN_SAVE: '#2b3849',
  BTN_LOAD: '#2b3849',  
  BTN_FIRE: '#d84315',
  BTN_EXTINGUISH: '#1594d8',
  BTN_DEAD: '#5d4037',
  BTN_CREATE: '#1cd951',
  BTN_DELETE: 'red',
};