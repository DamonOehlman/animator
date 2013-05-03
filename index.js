var active = false,
    FRAME_RATE = 1000 / 60,
    TEST_PROPS = [
        'r',
        'webkitR',
        'mozR',
        'oR',
        'msR'
    ],
    callbacks = [],
    frameIndex = 0,
    useAnimFrame = typeof window != 'undefined' && (function() {
        for (var ii = 0; ii < TEST_PROPS.length; ii++) {
            window.animFrame = window.animFrame || window[TEST_PROPS[ii] + 'equestAnimationFrame'];
        } // for
        
        return animFrame;
    })();

function frame(tickCount) {
    var ii, cbData;

    // set the tick count in the case that it hasn't been set already
    // tickCount = tickCount || window.mozAnimationStartTime || Date.now();

    // replace tickcount with date.now
    // TODO: replace with the correct timing helper
    tickCount = Date.now();
    
    // iterate through the callbacks
    for (ii = callbacks.length; ii--; ) {
        cbData = callbacks[ii];

        // check to see if this callback should fire this frame
        if (frameIndex % cbData.every === 0) {
            cbData.cb(tickCount, frameIndex);
        } // if
    } // for
    
    // increment the frame index
    frameIndex++;

    // schedule the animator for another call
    if (useAnimFrame && active) {
        animFrame(frame);
    } // if
} // frame

function detach(callback) {
    var ii;

    // iterate through the callbacks and remove the specified one
    for (ii = callbacks.length; ii--; ) {
        if (callbacks[ii].cb === callback) {
            callbacks.splice(ii, 1);
            break;
        } // if
    } // for

    // if we have no callbacks remaining, deativate
    if (callbacks.length === 0) {
        if (! useAnimFrame) {
            clearInterval(active);
        }

        active = false;
    }    
}

/**
## animator
*/
var animator = module.exports = function(callback, every) {
    callbacks[callbacks.length] = {
        cb: callback,
        every: every ? Math.round(every / FRAME_RATE) : 1
    };

    if (! active) {
        // bind to the animframe callback
        active = (useAnimFrame ? animFrame(frame) : setInterval(frame, 1000 / 60)) || true;
    }

    // return a detach helper
    return {
        stop: detach.bind(null, callback)
    };
};

/**
## tween(duration, callback)
*/
animator.tween = function(callback, duration) {
    var startTicks = Date.now(),
        tween;

    // initialise the duration to 1000 if not set
    duration = duration || 1000;

    // start the tween
    tween = animator(function(tickCount) {
        // calculate the updated value
        var elapsed = (tickCount || Date.now()) - startTicks,
            complete = elapsed >= duration,
            ret;

        ret = callback(elapsed, duration, complete);
        if (complete || (typeof ret != 'undefined' && (! ret))) {
            tween.stop();
        }
    });
};