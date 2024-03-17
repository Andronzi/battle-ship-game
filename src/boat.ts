type BoatWeight = 1 | 2 | 3 | 4;
type CurrentBoatCount = 0 & BoatWeight;

export interface Boat {
    weight: BoatWeight;
    totalCount: BoatWeight;
    currentCount: CurrentBoatCount;
    direction: Direction;
}

export type Coords = { x: number; y: number; }
export enum Direction {
    TOP = 'TOP',
    DOWN = 'DOWN',
    LEFT = 'LEFT',
    RIGHT = 'RIGHT',
}

export interface IMapBoatController {
    drawBoat(weight: BoatWeight, initialCoords: Coords, direction: Direction): Boat;
    drawBoatAction(action: any): void;
}

export interface IBoatPackRender {
    drawInitialBoats(): void;
    // Добавить подсвечивание для выбранной лодки

}

export class BoatPackRender implements IBoatPackRender{
    private readonly node: HTMLElement;

    constructor(node: HTMLElement) {
        this.node = node;
    }

    drawInitialBoats() {
        const boatPack = this.createContainer();

        let counter = 4;
        for (let weight = 1 as BoatWeight; weight <= 4; weight++) {
            for (let count = 4; count >= weight; --count) {
                this.createBoat(boatPack, weight, counter - count)
            }
            counter--;
        }
    }

    private createContainer(): HTMLElement {
        const boatPack = document.createElement('div');
        boatPack.className = 'boat-pack';
        boatPack.style.display = 'flex';
        boatPack.style.gap = '20px';
        boatPack.style.flexWrap = 'wrap'
        boatPack.style.maxWidth = '50%';
        this.node.appendChild(boatPack);
        return boatPack;
    }

    private createBoat(boatPack: HTMLElement, weight: BoatWeight, counter: number) {
        const boat = document.createElement('div');
        boat.className = 'boat';
        boat.style.display = 'flex';
        boat.style.marginTop = '20px';
        boatPack.appendChild(boat)


        for (let i = 0; i < weight; ++i) {
            const boatPart = document.createElement('div');
            boatPart.className = 'boat-part';
            boat.appendChild(boatPart);
            boatPart.style.width = '48px';
            boatPart.style.height = '48px';
            boatPart.style.border = '2px solid black';
        }
    }
}
