# animator

Hook into request animation frame or setInterval if rAF not available.

## Usage

Register a function that you want to occur on every animation tick (roughly every 1000 / 60 seconds).

```js
animator(function(tick) {
   console.log(tick);
});
```

You can also register a function that you want to execute every n milliseconds.  For instance, the following would register a function that would execute **approximately** every 100ms.

```js
animator(function(tick) {
    console.log(tick);
}, 100);
```

To remove an animation callback from the centralized list, use the detach function that is provided in the result of the animator function:

```js
var animation = animator(function(tick) {
    console.log(tick);
});

// stop animating after 5 seconds
setTimeout(animation.stop, 5000);
```