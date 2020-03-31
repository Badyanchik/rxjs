import { fromEvent, EMPTY } from 'rxjs';
import { map, debounceTime, distinctUntilChanged, switchMap, mergeMap, tap, catchError, filter } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

const url = 'https://api.github.com/search/users?q=';

const searchInput = document.querySelector('#search');
const resultBlock = document.querySelector('#result');

const getCardHtml = ({ avatar_url, login, html_url }) => `<div class="card">
        <div class="card-image">
          <img src="${avatar_url}" alt="${login}" />
          <span class="card-title">${login}</span>
        </div>
        <div class="card-action">
          <a href="${html_url}" target="_blank">Open GitHub</a>
        </div>
      </div>`;

const stream$ = fromEvent(searchInput, 'input')
  .pipe(map(({ target }) => target.value),
    debounceTime(1000),
    distinctUntilChanged(),
    tap(val => {
        resultBlock.innerHTML = val ? `
          <div class="progress">
            <div class="indeterminate"></div>
          </div>` : '';
      }
    ),
    filter(val => val.trim()),
    switchMap(val => ajax.getJSON(url + val).pipe(
      catchError(() => {
        resultBlock.innerHTML = '';
        return EMPTY;
      }),
    )),
    map(response => response.items),
    tap(items => {
      if (!items.length) {
        resultBlock.innerHTML = '<h6>Users not found</h6>';
      }
    }),
    mergeMap(items => items),
    tap(() => resultBlock.innerHTML = ''),
  )

stream$.subscribe(user => {
  resultBlock.insertAdjacentHTML('beforeend', getCardHtml(user));
})
