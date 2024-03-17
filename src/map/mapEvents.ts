import {BehaviorSubject, combineLatestWith, EMPTY, fromEvent, takeWhile, withLatestFrom} from "rxjs";
import {filter, switchMap, tap} from "rxjs/operators";
import {Direction} from "../boat";
import {ShipMap} from "./map";

interface IBoatEvents {
    chooseBoatLocation(): void;
}

export class BoatEvents implements IBoatEvents {
    private readonly boatWeightSubj$ = new BehaviorSubject<number | null>(null);
    private readonly boatDirectionSubj$ = new BehaviorSubject<Direction>(Direction.RIGHT);
    private readonly mouseOnMap$ = new BehaviorSubject(false);
    private readonly shipMap: ShipMap;

    constructor(shipMap: ShipMap) {
        this.shipMap = shipMap;
    }

    chooseBoat() {
        fromEvent(
            document.querySelectorAll('.boat-part')!,
            'click'
        ).subscribe((e: any) => {
            const parentElement = e.target.parentElement;

            this.boatWeightSubj$.next(parentElement.children.length);
        });
    }

    chooseBoatLocation() {
        const mouseMoveOnMap$ = fromEvent(
            document.querySelectorAll('.ship-map')!,
            'mousemove'
        ).pipe(tap(() => this.mouseOnMap$.next(true)));

        fromEvent(
            document.querySelector('.ship-map')!,
            'mouseleave'
        ).pipe(tap(() => {
            console.log('mouseleave');
            this.mouseOnMap$.next(false)
        })).subscribe();

        this.boatWeightSubj$.pipe(
            combineLatestWith(this.mouseOnMap$, mouseMoveOnMap$, this.boatDirectionSubj$),
            filter(([boatWeight]: any) => Boolean(boatWeight)),
            switchMap(([boatWeight, mouseOnMap, e, boatDirection]: any) => {
                const coords = {x: e.clientX, y: e.clientY};

                if (!this.shipMap.canAddBoat(coords, boatWeight, boatDirection)) {
                    return EMPTY;
                }

                return this.shipMap.highlightCells(
                    coords,
                    boatWeight,
                    boatDirection,
                ).pipe(
                    takeWhile(() => Boolean(mouseOnMap)),
                );
            }),
        ).subscribe();
    }

    chooseDirection() {
        fromEvent(document, 'keydown').pipe(
            withLatestFrom(this.mouseOnMap$, this.boatWeightSubj$),
            filter(([, mouseOnMap, boatWeight]: any) => {
                return Boolean(mouseOnMap) && Boolean(boatWeight);
            }),
        ).subscribe(([e]: any) => {
            switch (e.key) {
                case 'ArrowUp':
                    this.boatDirectionSubj$.next(Direction.DOWN);
                    break;
                case 'ArrowDown':
                    this.boatDirectionSubj$.next(Direction.TOP);
                    break;
                case 'ArrowRight':
                    this.boatDirectionSubj$.next(Direction.RIGHT);
                    break;
                case 'ArrowLeft':
                    this.boatDirectionSubj$.next(Direction.LEFT);
                    break;
            }
        });
    }

    putBoatOnMap() {
        fromEvent(
            document.querySelector('.ship-map')!,
            'click'
        ).pipe(
            withLatestFrom(this.boatWeightSubj$, this.boatDirectionSubj$),
            filter(([, boatWeight]: any) => Boolean(boatWeight)),
        ).subscribe((value: any) => {
            const [e, boatWeight, boatDirection] = value;
            const coords = {x: e.clientX, y: e.clientY};

            if (!this.shipMap.canAddBoat(coords, boatWeight, boatDirection)) {
                return;
            }

            this.shipMap.highlightCells(
                {x: e.clientX, y: e.clientY},
                boatWeight,
                boatDirection,
            ).subscribe(() => {
                this.boatWeightSubj$.next(null);
                this.boatDirectionSubj$.next(Direction.RIGHT);
                this.shipMap.putBoatOnMap({x: e.clientX, y: e.clientY}, boatWeight, boatDirection);
            });
        });
    }
}
