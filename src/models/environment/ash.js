import { SETTINGS } from "../../cfg/settings";
import { STATES } from "../../cfg/constants";
import { Cell } from "../cell";

export class Ash extends Cell {
    constructor(x, y) {
        super(x, y, STATES.ASH);
        this.recoveryTicks = 0;
    }

    tick(env) {
        if (SETTINGS.REGENERATION.REGENERATION_ENABLED) {
            if(Math.random() < SETTINGS.REGENERATION.RECOVERY_TICK_CHANCE[env.seasonIndex] && this.recoveryTicks < SETTINGS.REGENERATION.MIN_RECOVERY_TIME) {
                this.recoveryTicks++;
            }
            
            // регенерация возможна только после прохождения минимального времени восстановления
            if (this.recoveryTicks >= SETTINGS.REGENERATION.MIN_RECOVERY_TIME) {
                env.createCell(this.x, this.y, STATES.EMPTY);
            }
        }
    }

    getRecoveryTicks() {
        return this.recoveryTicks;
    }
}