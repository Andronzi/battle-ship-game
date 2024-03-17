import {Player} from "./player";
import {ShipMap} from "./map/map";
import {BoatPackRender} from "./boat";
import {BoatEvents} from "./map/mapEvents";
import {MapRender} from "./map/mapRender";


const root: HTMLElement = document.getElementById("root")!;

// Create map
const mapRender = new MapRender(root);

const shipMap = new ShipMap(mapRender);
shipMap.createEmptyMap();

mapRender.renderMap(shipMap.map);

// Игроки
Player.generatePlayer(root);

const boatPackRender = new BoatPackRender(root);
boatPackRender.drawInitialBoats();

// События работы пользователя с мапой
const boatEvents = new BoatEvents(shipMap);

boatEvents.chooseBoat();
boatEvents.chooseDirection();
boatEvents.chooseBoatLocation();
boatEvents.putBoatOnMap();


// I try to use mouseMoveOnMap$ and switchMao for addBoatSubj$
/*
mouseMoveOnMap$.pipe(
    debounceTime(500),
    filter(() => Boolean(mouseOnMap$.value)),
    distinctUntilChanged((prev: any, curr: any) => {
        return prev.clientX === curr.clientX && prev.clientY === curr.clientY;
    }),
    switchMap((e: any) => {
        return addBoatSubj$.pipe(
            filter(boatCount => Boolean(boatCount)),
            map((boatCount) => ({coords: [e.clientX, e.clientY], boatCount})),
        )
    })
).subscribe((value) => {
    const {coords, boatCount} = value;
    console.log(coords, boatCount);
})
*/
