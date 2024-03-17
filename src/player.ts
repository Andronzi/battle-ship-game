// type ShipMap = Cell[][];

import {delay, distinct, fromEvent} from "rxjs";
import {map} from "rxjs/operators";

class Game {
    // players: [Player, Player];
}

const DEFAULT_DELAY = 500;

export class Player {
    static generatePlayer(root: HTMLElement) {
        const playerInput = document.createElement('input');
        playerInput.style.marginTop = '10px';

        const playerName = document.createElement('div');

        root.appendChild(playerInput);
        root.appendChild(playerName);

        fromEvent(playerInput, 'input').pipe(
            delay(DEFAULT_DELAY),
            distinct(),
            map((event: Event) => {
                const input = event.target;

                if (input instanceof HTMLInputElement) {
                    return input.value;
                }

                throw new Error('playerInput must be instance of HTMLInputElement')
            })
        ).subscribe(name => {
            playerName.textContent = name;
        })
    }
}
