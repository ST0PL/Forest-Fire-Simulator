export class Cell {
    constructor(x, y, typeId) {
        this.x = x;
        this.y = y;
        this.state = typeId;
    }

    tick(env) {
        throw new Error("Необходима реализация в производном классе.");
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }
    getState() {
        return this.state;
    }
}