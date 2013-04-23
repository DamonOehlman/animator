var animate = require('./'),
    animator = animate(console.log.bind(console));

setTimeout(animator.stop, 1000);