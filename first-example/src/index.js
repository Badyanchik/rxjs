import { interval } from 'rxjs';
import { filter, map, take, scan } from 'rxjs/operators';

const people = [
  {name: 'Vladilen', age: 25},
  {name: 'Elena', age: 17},
  {name: 'Ivan', age: 18},
  {name: 'Igor', age: 14},
  {name: 'Lisa', age: 32},
  {name: 'Irina', age: 23},
  {name: 'Oleg', age: 20}
]

const btn = document.querySelector('#btn');
const resultBlock = document.querySelector('#main .result');

btn.addEventListener('click', () => {
  btn.disabled = true;

  interval(1000)
    .pipe(
      take(people.length),
      filter(i => people[i].age >= 18),
      map(i => people[i].name),
      scan((acc, val) => acc.concat(val), [])
    ).subscribe({
      next: res => resultBlock.textContent = res.join(', '),
      complete: () => {
        btn.disabled = false;
      }
  })
});
