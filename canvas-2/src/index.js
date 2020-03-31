import { fromEvent } from 'rxjs';
import { map, pairwise, switchMap, takeUntil, withLatestFrom, startWith, tap } from 'rxjs/operators';

const getCorrectCanvasSize = canvasEl => {
  const rect = canvasEl.getBoundingClientRect();
  const scale = window.devicePixelRatio;
  return {
    width: rect.width * scale,
    height: rect.height * scale,
    scale,
  }
}

const getInputStreamFromInputEl = inputEl => fromEvent(inputEl, 'input')
  .pipe(
    map(({ target }) => target.value),
    startWith(inputEl.value)
  );

const canvas = document.querySelector('canvas');
const clear = document.querySelector('#clear');
const range = document.querySelector('#range');
const color = document.querySelector('#color');

const ctx = canvas.getContext('2d');

const { width, height, scale } = getCorrectCanvasSize(canvas);
canvas.width = width;
canvas.height = height;
ctx.scale(scale, scale);

const lineWidth$ = getInputStreamFromInputEl(range);
const lineColor$ = getInputStreamFromInputEl(color);

const mouseup$ = fromEvent(canvas, 'mouseup');
const mouseout$ = fromEvent(canvas, 'mouseout');
const mousedown$ = fromEvent(canvas, 'mousedown')
  .pipe(
    withLatestFrom(lineWidth$, lineColor$,(_, lineWidth, lineColor) => {
      return {
        lineWidth,
        lineColor,
      }
    }),
    switchMap(options => {
      return fromEvent(canvas, 'mousemove')
        .pipe(
          map(e => ({
            x: e.offsetX,
            y: e.offsetY,
            options,
          })),
          pairwise(),
          takeUntil(mouseup$),
          takeUntil(mouseout$)
        )
    }),
  );

mousedown$.subscribe({
  next: ([from, to]) => {
    const { lineWidth, lineColor } = from.options;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineColor;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  }
})

fromEvent(clear, 'click')
  .subscribe(() => {
    const { width, height } = getCorrectCanvasSize(canvas);
    ctx.clearRect(0, 0, width, height);
  })
