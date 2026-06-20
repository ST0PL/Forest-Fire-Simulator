import { WIND_DIRECTIONS } from "../cfg/constants";
import { SETTINGS, getRandomInt } from "../cfg/settings";

export class WindController {
    constructor(){
        this.direction = WIND_DIRECTIONS.C;
        this.durationLimit = 0;
        this.duration = 0;
    }

    update(season) {
        if(this.duration < this.durationLimit) {
            this.duration++;
            return;
        }

        const chances = SETTINGS.WIND_ROSE.CHANCES[season];
        const rand = Math.random();
        let accum = 0;

        for(let key in chances) {
            accum += chances[key];

            if(rand < accum){
                this.direction = +key; // перевод значения ключа из строки в int и присваивание полю direction
                break;
            }
        }

        this.durationLimit = getRandomInt(0, SETTINGS.WIND_ROSE.DURATION_THRESHOLD);
        this.duration = 0;
    }

    getDirection() {
        return this.direction;
    }
}