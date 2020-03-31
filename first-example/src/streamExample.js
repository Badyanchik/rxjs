import { of, from, Observable, interval, timer, range } from 'rxjs'
import { scan } from 'rxjs/operators';

const stream$ = of(1, 2, 3, 4);

stream$.subscribe(val => {
  console.log('of method', val);
})






const arr$ = from([1,2,3,4,5,6,7,8,9,0])
  .pipe(
    scan((acc, val) => acc.concat(val), []),
  )

arr$.subscribe(val => {
  console.log('from method', val);
})






const streamObservable$ = new Observable(observer => {
  observer.next('Test value')

  setTimeout(() => observer.next('After 1 sec'), 1000);
  setTimeout(() => observer.complete(), 1500);

  setTimeout(() => observer.error('Error'), 2000);

  setTimeout(() => observer.next('After 2 sec'), 3000);

  return () => console.log('call streamObservable$ cleaning function');
})

streamObservable$.subscribe({
  next: val => console.log(val),
  error: err => console.log(err),
  complete: () => console.log('Complete')
})





const subscription = interval(500).subscribe({
  next: val => console.log('Interval example', val),
});

setTimeout(() => subscription.unsubscribe(), 5000);




timer(2500).subscribe(val => console.log('Timer example', val));



range(21, 10).subscribe(val => console.log('Range example', val));
