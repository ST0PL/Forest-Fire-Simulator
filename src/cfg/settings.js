import { SEASONS, WIND_DIRECTIONS } from "./constants";

// параметры симуляции

export const SETTINGS = {
  // размеры поля
  FIELD: {
    WIDTH: 40,
    HEIGHT: 15,
    CELL_SIZE: 20 // кол-во пикселей для отрисовки
  },

  // временнЫе переменные
  TIME: {
    TICK_INTERVAL_MS: 140,      // интервал одного тика (скорость симуляции)
  },

// влажность по сезонам
  CLIMATE: {
    SEASON_DURATION_TICKS: 40, // кол-во тиков на один сезон
    HUMIDITY: {
      [SEASONS.SPRING]: 75, // весна
      [SEASONS.SUMMER]: 20, // лето, засуха, высокий риск пожара
      [SEASONS.AUTUMN]: 90, // осень, дожди, низкий риск пожара
      [SEASONS.WINTER]: 15 // зима
    },
    // зимой есть вероятность, что снег потушит огонь за один тик
    WINTER_SNOW_EXTINGUISH_CHANCE: 0.35,
    EXTREME_DROUGHT_CHANCE: {
      [SEASONS.SPRING]: 0.005, // весна
      [SEASONS.SUMMER]: 0.040, // лето, высокий риск экстремальной засухи
      [SEASONS.AUTUMN]: 0.001, // осень, дождливый сезон, низкая вероятность возникновения засухи
      [SEASONS.WINTER]: 0 // зима
     },
    EXTREME_DROUGHT_DURATION_THRESHOLD: 20// верхний порог длительности засухи 
  },

  // параметры влажности
  MOISTURE: {
    ABSORB_RATE: 2, // прирост влаги за тик при восстановлении
    EVAPORATE_RATE: 1, // убыль влаги за тик при испарении
    PASSIVE_DRYING_RATE: 2, // доп. высыхание летом, если рядом ничего не горит
    PASSIVE_DRYING_THRESHOLD: 25, // если влажность воздуха < этого значения, то происходит пассивное засыхание
    EXTREME_DROUGHT_THRESHOLD: 15, // если влажность воздуха < этого значения, то старое дерево может засохнуть
    YOUNG_DRYING_BASE_OFFSET: 5,
    DEADTREE_FACTOR_MULTIPLIER: 0.05, // влияние сухостоя на потерю влажности,
    WINTER_BONUS: 5, 
    BASE_DRYING_FORMULA: {
      // формула скорости высыхания: скорость = A - (глобальнаяВлажность * B) (единиц/тик)
      A: 20, // максимальная скорость высыхания при низкой влажности (единиц/тик)
      B: 0.1 // коэффициент влияния влажности воздуха
    }
  },

  // параметры воспламенения
  FIRE: {
    BURN_DURATION_TICKS: 3, // кол-во тиков на горение дерева до превращения в пепел
    SPREAD_MULTIPLIER: 0.25,  // общий множитель шанса возгорания
    CRITICAL_MOISTURE_THRESHOLD: 10, // если влажность дерева < этого, то летом дерево может самовозгореться
    DEADTREE_MULTIPLIER: 2.0, // вклад сухостоя в воспламенение (тепловой проводник)
  },

  // параметры логики накопления стресса (только для старых деревьев)
  OLD_TREE: {
    STRESS_ACCUMULATION_RATE: 1.20, // базовая скорость накопления стресса за тик экстремальной жары
    STRESS_EVAPORATE_RATE: 0.15,// скорость снижения стресса, когда жара спала
    // насколько быстрее накапливается стресс
    HEAT_STRESS_THRESHOLD: 30, // верхний порог стресса для превращения в сухостой
    STRESS_CHANCE: 0.85 // вероятность получения деревом единицы стресса в засуху
  },

  // параметры роста деревьев
  GROWTH: {
    GROWTH_ENABLED: true,
    YOUNG_TO_ADULT_AGE: 500,   // число тиков до превращения молодого дерева в зрелое
    ADULT_TO_OLD_AGE: 1000     // число тиков до превращения зрелого дерева в старое
  },

  // параметры восстановления леса
  REGENERATION: {
    REGENERATION_ENABLED: true,
    MIN_RECOVERY_TIME: 120,    // мин. число тиков, прежде чем на пепле сможет что-то вырасти
    RECOVERY_TICK_CHANCE: { // вероятности получить тик восстановления
      [SEASONS.SPRING]: 0.5,
      [SEASONS.SUMMER]: 0.5,
      [SEASONS.AUTUMN]: 0.5,
      [SEASONS.WINTER]: 0 
    },
    BASE_CHANCE_PER_TICK: 0.001, // вероятность прорастания

    SEASON_MULTIPLIERS: {     // модификаторы шанса восстановления по сезонам (умножаются на BASE_CHANCE)
      [SEASONS.SPRING]: 1.3,  // весна, лучший сезон для проростания семян
      [SEASONS.SUMMER]: 0.7,  // лето, засуха
      [SEASONS.AUTUMN]: 1.1,  // осень, хорошая влажность, рост вероятнее, чем летом
      [SEASONS.WINTER]: 0.0   // зима, ничего не растёт
    }
  },

  // вероятностные параметры генерации элементов поля
  INIT: {
    PROBABILITY: {
      YOUNG_TREE: 0.25,  // 25%
      ADULT_TREE: 0.55,  // 30% (0.25..0.55)
      OLD_TREE: 0.70,    // 15% (0.55..0.70)
    },
    // начальная влажность при генерации
    INITIAL_MOISTURE: {
      YOUNG: 85,
      ADULT: 75,
      OLD: 60,
    }
  },

  TREE_TYPES: {
    YOUNG: {
      BASE_FIRE_CHANCE: 0.75,  // легко загораются
      DRYING_SPEED_MULTIPLIER: 1.5,  // быстрее сохнут
      DRYING_PROBABILITY: 0.7
    },
    ADULT: {
      BASE_FIRE_CHANCE: 0.5,   // средние параметры
      DRYING_SPEED_MULTIPLIER: 1.0,
      DRYING_PROBABILITY: 0.4
    },
    OLD: {
      BASE_FIRE_CHANCE: 0.25,  // слабовозгораемые
      DRYING_SPEED_MULTIPLIER: 0.5,  // медленнее сохнут в силу толщины коры
      DRYING_PROBABILITY: 0.1
    },
    DEAD: {
      BASE_FIRE_CHANCE: 1.0,
      DRYING_SPEED_MULTIPLIER: 0,
      DRYING_PROBABILITY: 0,
    }
  },



  WIND_ROSE: {
    // направления относительно горящей клетки
    DIRECTIONS: {
      [WIND_DIRECTIONS.N]: { dx: 0, dy: 1 }, // North - Северный
      [WIND_DIRECTIONS.S]: { dx: 0, dy: -1 }, // South - Южный
      [WIND_DIRECTIONS.W]: { dx: 1, dy: 0  }, // West - Западный, x2 > x_source
      [WIND_DIRECTIONS.E]: { dx: -1, dy: 0 }, // East - Восточный, x2 < x_source
      [WIND_DIRECTIONS.NW]: { dx: 1, dy: 1  }, // North-West - Северо-западный, x2 > x_source && y2 > y_source 
      [WIND_DIRECTIONS.NE]: { dx: -1, dy: 1  }, // North-East - Северо-востоный, x2 < x_source && y2 > y_source 
      [WIND_DIRECTIONS.SW]: { dx: 1, dy: -1 }, // South-West - Юго-западный, x2 > x_source && y2 < y_source
      [WIND_DIRECTIONS.SE]: { dx: -1, dy: -1 }, // South-East - Юго-восточный, x2 < x_source && y2 < y_source
      [WIND_DIRECTIONS.C]: null, // Calm - безветрие
    },

    // вероятности возникновения определенных типов ветров по сезонам
    CHANCES: {
      [SEASONS.SPRING]: {
        [WIND_DIRECTIONS.N]: 0.11,
        [WIND_DIRECTIONS.S]: 0.16,
        [WIND_DIRECTIONS.W]: 0.22,
        [WIND_DIRECTIONS.E]: 0.11,
        [WIND_DIRECTIONS.NW]: 0.08,
        [WIND_DIRECTIONS.NE]: 0.09,
        [WIND_DIRECTIONS.SW]: 0.15,
        [WIND_DIRECTIONS.SE]: 0.04,
        [WIND_DIRECTIONS.C]: 0.04    
      },
      [SEASONS.SUMMER]: {
        [WIND_DIRECTIONS.N]: 0.18,
        [WIND_DIRECTIONS.S]: 0.07,
        [WIND_DIRECTIONS.W]: 0.20,
        [WIND_DIRECTIONS.E]: 0.13,
        [WIND_DIRECTIONS.NW]: 0.14,
        [WIND_DIRECTIONS.NE]: 0.12,
        [WIND_DIRECTIONS.SW]: 0.07,
        [WIND_DIRECTIONS.SE]: 0.04,
        [WIND_DIRECTIONS.C]: 0.05    
      },
      [SEASONS.AUTUMN]: {
        [WIND_DIRECTIONS.N]: 0.07,
        [WIND_DIRECTIONS.S]: 0.18,
        [WIND_DIRECTIONS.W]: 0.23,
        [WIND_DIRECTIONS.E]: 0.09,
        [WIND_DIRECTIONS.NW]: 0.07,
        [WIND_DIRECTIONS.NE]: 0.06,
        [WIND_DIRECTIONS.SW]: 0.21,
        [WIND_DIRECTIONS.SE]: 0.05,
        [WIND_DIRECTIONS.C]: 0.04    
      },
      [SEASONS.WINTER]: {
        [WIND_DIRECTIONS.N]: 0.03,
        [WIND_DIRECTIONS.S]: 0.28,
        [WIND_DIRECTIONS.W]: 0.14,
        [WIND_DIRECTIONS.E]: 0.04,
        [WIND_DIRECTIONS.NW]: 0.04,
        [WIND_DIRECTIONS.NE]: 0.03,
        [WIND_DIRECTIONS.SW]: 0.35,
        [WIND_DIRECTIONS.SE]: 0.04,
        [WIND_DIRECTIONS.C]: 0.05    
      }
    },

    DURATION_THRESHOLD: 50, // верхний порог длительности ветров
    MULTIPLIER: 2.0 // модификатор возгорания при совпадении координат (направления)
  }
};

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  };

export function round(value, digits){
  let k = 10**digits;
  return Math.round(value*k)/k
}