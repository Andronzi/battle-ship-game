const enum Cell {
    EMPTY = 0,
    SHIP = 1,
    MISS = 2,
    HIT = 3,
    SUNK = 4,
}

type ShipMap = Cell[][];

class Player {
    name: string;
    map: ShipMap;
}

class Game {
    maps: [ShipMap, ShipMap];
}
