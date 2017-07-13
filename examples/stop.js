const animator = require('..');
const animation = animator(tick => console.log(tick));

// stop animating after 5 seconds
setTimeout(animation.stop, 5000);
