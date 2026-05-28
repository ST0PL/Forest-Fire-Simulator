import { Tree } from './tree';
import { SETTINGS } from '../cfg/settings';
import { STATES } from '../cfg/constants';

export class AdultTree extends Tree {
  constructor(x, y) {
    super(x, y, STATES.ADULT);
    this.moisture = SETTINGS.INIT.INITIAL_MOISTURE.ADULT;
    this.age = SETTINGS.GROWTH.YOUNG_TO_ADULT_AGE;
  }
}