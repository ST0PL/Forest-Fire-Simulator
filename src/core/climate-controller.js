import { SETTINGS, getRandomInt } from '../cfg/settings';
import { SEASONS, SEASON_NAMES, WIND_DIRECTION_NAMES } from '../cfg/constants';
import { WindController } from './wind-controller';

export class ClimateController {
  constructor() {
    this.currentSeasonIndex = 0;
    this.globalMoisture = 70;
    this.extremeDroughtDurationLimit = 0;
    this.extremeDroughtDuration = 0;
    this.windController = new WindController();
  }
  
  update(tick) {
    // индекс сезона = (число тиков / длительность сезона) MOD количество сезонов
    this.currentSeasonIndex = Math.floor((tick / SETTINGS.CLIMATE.SEASON_DURATION_TICKS) % Object.keys(SEASONS).length);
    this.windController.update(this.currentSeasonIndex);

    // логика засухи
    if((this.extremeDroughtDuration === 0) && (Math.random() < SETTINGS.CLIMATE.EXTREME_DROUGHT_CHANCE[this.currentSeasonIndex])) {
      this.extremeDroughtDurationLimit = getRandomInt(1, SETTINGS.CLIMATE.EXTREME_DROUGHT_DURATION_THRESHOLD)
      this.extremeDroughtDuration = 1;
      this.globalMoisture = SETTINGS.MOISTURE.EXTREME_DROUGHT_THRESHOLD;
    }
    
    else if(this.extremeDroughtDuration > 0) {
      this.extremeDroughtDuration++;

      // засуха заканчивается по истечению предела длительности, либо при наступлении зимы
      if((this.extremeDroughtDuration >= this.extremeDroughtDurationLimit) || this.currentSeasonIndex == SEASONS.WINTER) {
        this.extremeDroughtDuration = 0;
        this.globalMoisture = SETTINGS.CLIMATE.HUMIDITY[this.currentSeasonIndex];
        }
      }
    else {
      this.globalMoisture = SETTINGS.CLIMATE.HUMIDITY[this.currentSeasonIndex];
    }
  }
  getSeasonName() {
    return SEASON_NAMES[this.currentSeasonIndex];
  }

  getSeasonIndex() {
    return this.currentSeasonIndex;
  }

  getWindDirectionName() {
    return WIND_DIRECTION_NAMES[this.windController.direction];
  }

  isExtremeDroughtActive() {
    return this.extremeDroughtDuration > 0;
  }
}