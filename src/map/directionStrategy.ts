import {Coords} from "../boat";


export interface DirectionStrategy {
    getCellCoords(cellNumber: Coords, offset: number): Coords;
}

export class TopDirectionStrategy implements DirectionStrategy {
    getCellCoords(cellNumber: any, offset: number) {
        return {
            x: cellNumber.x,
            y: cellNumber.y + offset,
        };
    }
}

export class DownDirectionStrategy implements DirectionStrategy {
    getCellCoords(cellNumber: any, offset: number) {
        return {
            x: cellNumber.x,
            y: cellNumber.y - offset,
        };
    }
}

export class RightDirectionStrategy implements DirectionStrategy {
    getCellCoords(cellNumber: any, offset: number) {
        return {
            x: cellNumber.x + offset,
            y: cellNumber.y,
        };
    }
}

export class LeftDirectionStrategy implements DirectionStrategy {
    getCellCoords(cellNumber: any, offset: number) {
        return {
            x: cellNumber.x - offset,
            y: cellNumber.y,
        };
    }
}
