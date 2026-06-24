import { WEATHER } from "../cfg/constants";
import { SETTINGS, getRandomInt } from "../cfg/settings";

export class WeatherController {
    constructor(){
        this.weather = WEATHER.CLEAR;
        this.durationLimit = 0;
        this.duration = 0;
    }

    update(season) {
        
        if(!SETTINGS.CLIMATE.WEATHER.ENABLED) {
            return;
        }
        
        if(this.duration < this.durationLimit) {
            this.duration++;
            return;
        }

        const chances = SETTINGS.CLIMATE.WEATHER.CHANCES[season];
        const rand = Math.random();
        let accum = 0;

        for(let key in chances) {
            accum += chances[key];

            if(rand < accum){
                this.weather = +key; // перевод значения ключа из строки в int и присваивание полю direction
                break;
            }
        }

        this.durationLimit = getRandomInt(0, SETTINGS.CLIMATE.WEATHER.WEATHER_DURATION_THRESHOLD);
        this.duration = 0;
    }

    getWeather() {
        return this.weather;
    }
}