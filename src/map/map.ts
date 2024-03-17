import {Coords, Direction} from "../boat";
import {
    BehaviorSubject,
    combineLatestWith,
    debounceTime, EMPTY,
    fromEvent,
    Observable,
    take, takeUntil,
    takeWhile,
    withLatestFrom
} from "rxjs";
import {filter, switchMap, tap} from "rxjs/operators";
import {
    DirectionStrategy,
    DownDirectionStrategy, LeftDirectionStrategy,
    RightDirectionStrategy,
    TopDirectionStrategy
} from "./directionStrategy";
import {MapRender} from "./mapRender";
import {DEFAULT_MAP_CONFIG} from "./constants";

export enum Cell {
    EMPTY = 0,
    SHIP = 1,
    MISS = 2,
    HIT = 3,
    SUNK = 4,
}

export type IMap = Cell[][];
export type MapConfig = {
    cellWidth: number;
    cellHeight: number;
    cellCount: number;
    shipCount: number;
}

export class ShipMap {
    map: IMap | null = null;
    mapConfig: MapConfig;
    private readonly mapRender: MapRender;
    private readonly directionStrategies: Map<Direction, DirectionStrategy>

    constructor(mapRender: MapRender, mapConfig?: MapConfig) {
        this.mapRender = mapRender;
        this.mapConfig = mapConfig ?? DEFAULT_MAP_CONFIG;
        this.directionStrategies = new Map([
            [Direction.TOP, new TopDirectionStrategy()],
            [Direction.DOWN, new DownDirectionStrategy()],
            [Direction.RIGHT, new RightDirectionStrategy()],
            [Direction.LEFT, new LeftDirectionStrategy()],
        ]);
    }

    createEmptyMap() {
        this.map = Array(this.mapConfig.cellCount).fill(null).map(() => Array(this.mapConfig.cellCount).fill(Cell.EMPTY));
    }

    canAddBoat(coords: Coords, boatWeight: number, boatDirection: Direction) {
        const cellNumber = this.identifyCellNumber(coords);
        const cellArray = this.getCells(cellNumber, boatWeight, boatDirection);

        if (cellArray.length < boatWeight) {
            return false;
        }

        return this.isCellsEmpty(cellArray);
    }

    highlightCells(coords: Coords, boatWeight: number, boatDirection: Direction) {
        const cellNumber = this.identifyCellNumber(coords);

        return new Observable(observer => {
            const directionStrategy = this.directionStrategies.get(boatDirection)!;

            for (let i = 0; i < boatWeight; ++i) {
                const cellCoords = directionStrategy.getCellCoords(cellNumber, i);
                this.mapRender.highLightCell(cellCoords);
            }

            observer.next();

            return () => {
                for (let i = 0; i < boatWeight; ++i) {
                    const cellCoords = directionStrategy.getCellCoords(cellNumber, i);

                    if (this.map![cellCoords.x][cellCoords.y] === Cell.EMPTY) {
                        this.mapRender.deleteHighLight(cellCoords);
                    }
                }
            }
        })
    }

    putBoatOnMap(coords: Coords, boatWeight: number, boatDirection: Direction) {
        const cellNumber = this.identifyCellNumber(coords);
        const directionStrategy = this.directionStrategies.get(boatDirection)!;

        for (let i = 0; i < boatWeight; ++i) {
            const cellCoords = directionStrategy.getCellCoords(cellNumber, i);

            this.map![cellCoords.x][cellCoords.y] = Cell.SHIP;
            this.mapRender.highLightCell(cellCoords);
        }

        console.log(this.map);
    }

    private isCellsEmpty(cellArray: Cell[]) {
        return cellArray.every(cell => cell === Cell.EMPTY);
    }

    private getCells(cellNumber: Coords, boatWeight: number, boatDirection: Direction): Cell[] {
        const cellArray: Cell[] = [];
        const directionStrategy = this.directionStrategies.get(boatDirection)!;

        for (let i = 0; i < boatWeight; ++i) {
            const cellCoords = directionStrategy.getCellCoords(cellNumber, i);

            if (this.isBoundariesCrossed(cellCoords, boatDirection)) {
                break;
            }

            cellArray.push(this.map![cellCoords.x][cellCoords.y]);
        }

        return cellArray;
    }

    private isBoundariesCrossed(coords: Coords, boatDirection: Direction) {
        const horizontalDirection = boatDirection === Direction.LEFT || boatDirection === Direction.RIGHT;

        if (horizontalDirection && (coords.x < 0 || coords.x >= this.mapConfig.cellCount)) {
            return true;
        }

        const verticalDirection = boatDirection === Direction.DOWN || boatDirection === Direction.TOP;

        if (verticalDirection && (coords.y < 0 || coords.y >= this.mapConfig.cellCount)) {
            return true;
        }

        return false;
    }

    private identifyCellNumber(coords: Coords): Coords {
        const x = Math.floor(coords.x / this.mapConfig.cellWidth);
        const y = Math.floor(coords.y / this.mapConfig.cellHeight);

        return {x, y};
    }
}
