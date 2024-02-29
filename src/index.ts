import {Observable} from "rxjs";

const stream$: Observable<number> = new Observable(subscriber => subscriber.next(3));

stream$.subscribe((v ) => console.log(v));

