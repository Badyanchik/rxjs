import { interval, fromEvent } from 'rxjs';
import { take, mapTo, map, filter, takeLast, takeWhile, takeUntil, scan, tap, reduce, mergeMap } from 'rxjs/operators'

const stream$ = interval(500)
  .pipe(
    map(val => val + 1),
    tap(val => console.log('Stream val: ', val)),
    // filter(val => val % 2 === 0),
    takeWhile(val => val < 10),
    takeLast(5),
    // scan((acc, val) => acc + val, 0),
    reduce((acc, val) => acc + val, 0),
  )

const clickStream$ = fromEvent(document, 'click')
  .pipe(
    mergeMap(() => stream$)
  )

clickStream$.subscribe({
  next: value => console.log('Next: ', value),
  complete: () => console.log('Complete')
})
