import { Subject } from 'rxjs'
import { scan, startWith, shareReplay } from 'rxjs/operators'

const pre = document.querySelector('pre');
const actionTypes = {
  INCREMENT: 'INCREMENT',
  DECREMENT: 'DECREMENT',
  ADD: 'ADD',
  DEFAULT: 'DEFAULT',
};

const initialState = {
  counter: 0
};

const handlers = {
  [actionTypes.INCREMENT]: state => ({
    ...state,
    counter: state.counter + 1,
  }),
  [actionTypes.DECREMENT]: state => ({
    ...state,
    counter: state.counter - 1,
  }),
  [actionTypes.ADD]: (state, { payload }) => ({
    ...state,
    counter: state.counter + payload,
  }),
  [actionTypes.DEFAULT]: state => state,
};

const reducer = (state = initialState, action = {}) => {
  const handler = handlers[action.type] || handlers[actionTypes.DEFAULT];
  return handler(state, action);
}

const createStore = rootReducer => {
  const subj$ = new Subject();

  const store$ = subj$.pipe(
    startWith({type: '__INIT__'}),
    scan(rootReducer, undefined),
    shareReplay(1)
  );

  store$.dispatch = action => subj$.next(action);

  return store$;
}

const store$ = createStore(reducer);

store$.subscribe(state => {
  pre.innerHTML = JSON.stringify(state, null, 2);
})

const incrementBtn = document.querySelector('#increment');
const decrementBtn = document.querySelector('#decrement');
const addBtn = document.querySelector('#add');

incrementBtn.addEventListener('click', () => {
  store$.dispatch({type: actionTypes.INCREMENT});
});
decrementBtn.addEventListener('click', () => {
  store$.dispatch({type: actionTypes.DECREMENT});
});
addBtn.addEventListener('click', () => {
  store$.dispatch({type: actionTypes.ADD, payload: 10});
});
