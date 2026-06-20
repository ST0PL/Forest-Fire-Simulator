export class Statistic {
    constructor(young, adult, old, dead, fire, ash, avgMoisture) {
        this.young = young;
        this.adult = adult;
        this.old = old;
        this.dead = dead;
        this.fire = fire;
        this.ash = ash;
        this.avgMoisture = avgMoisture;
    }

    getYoung() {
        return this.young;
    }
    
    getAdult() {
        return this.adult;
    }

    getOld() {
        return this.old;
    }

    getDead() {
        return this.dead;
    }

    getFire() {
        return this.fire;
    }

    getAsh() {
        return this.ash;
    }

    getAvarageMoisture() {
        return this.avgMoisture;
    }    
}