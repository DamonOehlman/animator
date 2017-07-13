
# animator

Hook into request animation frame or setInterval if rAF not available.


[![NPM](https://nodei.co/npm/animator.png)](https://nodei.co/npm/animator/)

[![bitHound Score](https://www.bithound.io/github/DamonOehlman/animator/badges/score.svg)](https://www.bithound.io/github/DamonOehlman/animator) 

## Usage

Register a function that you want to occur on every animation tick
(roughly every 1000 / 60 seconds).

```js
const animator = require('animator');
animator(tick => console.log(tick));

```

You can also register a function that you want to execute every n
milliseconds.  For instance, the following would register a function
that would execute **approximately** every 100ms.

```js
const animator = require('animator');
animator(tick => console.log(tick), 100);

```

To remove an animation callback from the centralized list, use the detach function that is provided in the result of the animator function:

```js
const animator = require('animator');
const animation = animator(tick => console.log(tick));

// stop animating after 5 seconds
setTimeout(animation.stop, 5000);

```

## Easing

As part of the animator library, a suite of [easing equations](http://robertpenner.com/easing/)
have been included which make things pretty interesting.  Here is a larger example of what can be done
using `animator`:

```js
const animator = require('animator');
const crel = require('crel');

window.addEventListener('DOMContentLoaded', () => {
  const buttonContainer = crel('div');
  const easingTypeSelect = crel('select');
  const btnAnimate = crel('button', 'animate');
  const easingTypes = Object.keys(animator.easing);

  const canvas = crel('canvas', {
    width: 600,
    height: 600
  });

  easingTypes.forEach(easingType => {
    const opt = crel('option');

    opt.text = easingType;
    easingTypeSelect.add(opt, null);
  });

  btnAnimate.addEventListener('click', () => {
    const easingType = easingTypes[easingTypeSelect.selectedIndex];
    const context = canvas.getContext('2d');
    const easeFn = animator.easing[easingType];

    animator.tween(function(elapsed, duration, complete) {
      const x = easeFn(elapsed, 100, 400, duration);
      const y = easeFn(elapsed, 100, 400, duration);

      // NOTE: clear rect is so slow...
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillRect(x, y, 10, 10);
    }, 1500);
  });

  buttonContainer.appendChild(easingTypeSelect);
  buttonContainer.appendChild(btnAnimate);

  // create the canvas
  document.body.appendChild(buttonContainer);
  document.body.insertBefore(canvas, buttonContainer);
});


```

## License(s)

### MIT

Copyright (c) 2017 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
