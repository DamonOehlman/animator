var animator = require('..');

var animation = animator(function(tick) {
  console.log(tick);
});

// stop animating after 5 seconds
setTimeout(animation.stop, 5000);