import { SETTINGS } from "../../cfg/settings";
import { STATES } from "../../cfg/constants";
import { Cell } from "../cell";
import { YoungTree } from "../tree/young-tree";

export class Empty extends Cell {
    constructor(x, y) {
        super(x, y, STATES.EMPTY);
    }

    tick(env) {
        if (SETTINGS.REGENERATION.REGENERATION_ENABLED) {
            const seasonMultiplier = SETTINGS.REGENERATION.SEASON_MULTIPLIERS[env.seasonIndex];
            const appearanceChance = SETTINGS.REGENERATION.BASE_CHANCE_PER_TICK * seasonMultiplier;
        
            if (Math.random() < appearanceChance) {
                env.replaceCell(new YoungTree(this.x, this.y));
            }
        }
    }
}