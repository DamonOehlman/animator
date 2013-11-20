# animator

Hook into request animation frame or setInterval if rAF not available.


[![NPM](https://nodei.co/npm/animator.png)](https://nodei.co/npm/animator/)


## Usage

Register a function that you want to occur on every animation tick
(roughly every 1000 / 60 seconds).

```js
var animator = require('animator');

animator(function(tick) {
  console.log(tick);
});
```

You can also register a function that you want to execute every n
milliseconds.  For instance, the following would register a function
that would execute **approximately** every 100ms.

```js
var animator = require('animator');

animator(function(tick) {
  console.log(tick);
}, 100);
```

To remove an animation callback from the centralized list, use the detach function that is provided in the result of the animator function:

```js
var animator = require('animator');

var animation = animator(function(tick) {
  console.log(tick);
});

// stop animating after 5 seconds
setTimeout(animation.stop, 5000);
```

## License(s)

### MIT

Copyright (c) 2013 Damon Oehlman <damon.oehlman@gmail.com>

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
