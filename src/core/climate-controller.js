import { SETTINGS, getRandomInt, round } from '../cfg/settings';
import { SEASONS, SEASON_NAMES, WEATHER, WEATHER_NAMES, WIND_DIRECTION_NAMES } from '../cfg/constants';
import { WindController } from './wind-controller';
import { WeatherController } from './weather-controller';

export class ClimateController {
  constructor() {
    this.currentSeasonIndex = 0;
    this.globalMoisture =  SETTINGS.CLIMATE.HUMIDITY[this.currentSeasonIndex];
    this.extremeDroughtDurationLimit = 0;
    this.extremeDroughtDuration = 0;
    this.windController = new WindController();
    this.weatherController = new WeatherController();
  }
  
  update(tick) {
    // индекс сезона = (число тиков / длительность сезона) MOD количество сезонов
    this.currentSeasonIndex = Math.floor((tick / SETTINGS.CLIMATE.SEASON_DURATION_TICKS) % Object.keys(SEASONS).length);
    this.windController.update(this.currentSeasonIndex);
    this.weatherController.update(this.currentSeasonIndex);

    const isRain = [WEATHER.RAINY, WEATHER.STORMY].includes(this.weatherController.getWeather());

    // логика засухи (возникает только если нет осадков)
    if(!isRain && !this.isExtremeDrought() && (Math.random() < SETTINGS.CLIMATE.EXTREME_DROUGHT_CHANCE[this.currentSeasonIndex])) {

      this.extremeDroughtDurationLimit = getRandomInt(1, SETTINGS.CLIMATE.EXTREME_DROUGHT_DURATION_THRESHOLD)
      this.extremeDroughtDuration = 1;
      this.globalMoisture = SETTINGS.MOISTURE.EXTREME_DROUGHT_THRESHOLD;
    }
    
    else if(this.isExtremeDrought()) {
      this.extremeDroughtDuration++;

      // засуха заканчивается по истечению предела длительности, либо при наступлении зимы
      if((this.extremeDroughtDuration >= this.extremeDroughtDurationLimit) ||
          this.currentSeasonIndex == SEASONS.WINTER || isRain) {
        this.extremeDroughtDuration = 0;
        this.globalMoisture = SETTINGS.CLIMATE.HUMIDITY[this.currentSeasonIndex];
        }
      }
    else {
      const baseHumidity = SETTINGS.CLIMATE.HUMIDITY[this.currentSeasonIndex];
      const weatherMultiplier = SETTINGS.CLIMATE.WEATHER.HUMIDITY_MULTIPLIERS[this.weatherController.getWeather()];

      this.globalMoisture =  Math.min(98, Math.round(baseHumidity * weatherMultiplier));
    }
  }

  getSeasonIndex() {
    return this.currentSeasonIndex;
  }
  
  getSeasonName() {
    return SEASON_NAMES[this.currentSeasonIndex];
  }

  getWindDirectionName() {
    return WIND_DIRECTION_NAMES[this.windController.getDirection()];
  }

  getWeatherName() {
    const weather = this.weatherController.getWeather();
    const weatherName = WEATHER_NAMES[weather];
    if([WEATHER.RAINY, WEATHER.STORMY].includes(weather)) {
      return weatherName[this.currentSeasonIndex === SEASONS.WINTER ? 1 : 0];
    }
    return weatherName;  
  }

  isExtremeDrought() {
    return this.extremeDroughtDuration > 0;
  }

  getMoisture() {
    return this.globalMoisture;
  }

  getWindController() {
    return this.windController;
  }

  getWeatherController() {
    return this.weatherController;
  }

  static createFromObject(object) {
    const climateController = Object.assign(new ClimateController(), object);
    climateController.windController = Object.assign(new WindController(), object.windController);
    climateController.weatherController = Object.assign(new WeatherController(), object.weatherController);
    return climateController;
  }
}