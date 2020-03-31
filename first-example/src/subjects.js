import { Subject, ReplaySubject, BehaviorSubject } from 'rxjs';

document.addEventListener('click', () => {
  const stream$ = new Subject();

  stream$.subscribe(val => {
    console.log(val)
  });

  stream$.next('stream$ Click 1');
  stream$.next('stream$ Click 2');
  stream$.next('stream$ Click 3');



  const behaviorStream$ = new BehaviorSubject('behaviorStream$ First');

  behaviorStream$.subscribe(val => {
    console.log(val)
  });

  behaviorStream$.next('behaviorStream$ Click 1');
  behaviorStream$.next('behaviorStream$ Click 2');
  behaviorStream$.next('behaviorStream$ Click 3');



  const replayStream$ = new ReplaySubject(2);

  replayStream$.next('replayStream$ Click 1');
  replayStream$.next('replayStream$ Click 2');
  replayStream$.next('replayStream$ Click 3');

  replayStream$.subscribe(val => {
    console.log(val)
  });
})
