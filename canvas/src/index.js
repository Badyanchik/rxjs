import { fromEvent } from 'rxjs';
import { map } from 'rxjs/operators'

const canvas = document.querySelector('canvas');
const clearCanvasBtn = document.querySelector('#clear');


fromEvent(canvas, 'mousemove')
  .pipe(
    map(e => ({
      x: e.offsetX,
      y: e.offsetY,
      ctx: e.target.getContext('2d')
    }))
  )
  .subscribe(({ x, y, ctx }) => {
    ctx.fillRect(x, y, 2, 2);
  })

fromEvent(clearCanvasBtn, 'click')
  .subscribe(() => {
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
  })
