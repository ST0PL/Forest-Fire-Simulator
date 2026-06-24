import { SEASONS, STATES } from "../../cfg/constants";
import { Cell } from "../cell";

export class Water extends Cell{
    constructor(x, y) {
        super(x, y, STATES.WATER);
    }

    tick(env) {
        this.state = env.seasonIndex === SEASONS.WINTER ? STATES.ICE : STATES.WATER;
    }
}