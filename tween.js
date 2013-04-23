var animate = require('./');

module.exports = function(startValue, endValue, fn, duration, callback) {
    
    var startTicks = Date.now(),
        change = endValue - startValue,
        animator = animate(runTween);

    function runTween(tickCount) {
        // initialise the tick count if it isn't already defined
        // not all browsers pass through the ticks with the requestAnimationFrame :/
        tickCount = tickCount ? tickCount : new Date().getTime();
        
        // calculate the updated value
        var elapsed = tickCount - startTicks,
            updatedValue = fn(elapsed, startValue, change, duration),
            complete = startTicks + duration <= tickCount,
            cont = !complete,
            retVal;

        if (callback) {
            // call the callback
            retVal = callback(updatedValue, complete, elapsed);

            // check the return value
            cont = typeof retVal != 'undefined' ? retVal && cont : cont;
        } // if

        // if we should not continue, then stop the animation
        if (! cont) {
            animator.stop();
        }
    }
};