var animator = require('./');

function test(tick) {
    console.log(tick);
}

animator(test, 500);

setTimeout(function() {
    animator.detach(test);
}, 5000);