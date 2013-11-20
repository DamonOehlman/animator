/**
  # animator

  Hook into request animation frame or setInterval if rAF not available.

  ## Usage

  Register a function that you want to occur on every animation tick
  (roughly every 1000 / 60 seconds).

  <<< examples/ticker.js

  You can also register a function that you want to execute every n
  milliseconds.  For instance, the following would register a function
  that would execute **approximately** every 100ms.

  <<< examples/tick-every-100ms.js

  To remove an animation callback from the centralized list, use the detach function that is provided in the result of the animator function:

  <<< examples/stop.js

**/
(function (root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define(factory);
  } else {
    root.animator = factory();
  }
}(this, function(){
  'use strict';

  var active = false;
  var FRAME_RATE = 1000 / 60;
  var TEST_PROPS = ['r', 'webkitR', 'mozR', 'oR', 'msR'];
  var callbacks = [];
  var frameIndex = 0;
  var useAnimFrame = typeof window != 'undefined' && (function() {
    for (var ii = 0; ii < TEST_PROPS.length; ii++) {
      window.animFrame = window.animFrame ||
        window[TEST_PROPS[ii] + 'equestAnimationFrame'];
    } // for

    return animFrame;
  })();

  var BACK_S = 1.70158;
  var HALF_PI = Math.PI / 2;
  var TWO_PI = Math.PI * 2;
  var ANI_WAIT = 1000 / 60 | 0;

  // initialise math function shortcuts
  var abs = Math.abs;
  var pow = Math.pow;
  var sin = Math.sin;
  var asin = Math.asin;
  var cos = Math.cos;
  var easingFns;

  function tick() {
    return (typeof performance != 'undefined' ? performance : Date).now();
  }

  function frame(tickCount) {
    var ii;
    var cbData;

    // set the tick count in the case that it hasn't been set already
    // tickCount = tickCount || window.mozAnimationStartTime || Date.now();

    // replace tickcount with date.now
    // TODO: replace with the correct timing helper
    tickCount = tickCount || tick();

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
    // iterate through the callbacks and remove the specified one
    for (var ii = callbacks.length; ii--; ) {
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
  function animator(callback, every) {
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
    var startTicks = tick();
    var tween;

    // initialise the duration to 1000 if not set
    duration = duration || 1000;

    // start the tween
    tween = animator(function(tickCount) {
      // calculate the updated value
      var elapsed = (tickCount || tick()) - startTicks;
      var complete = elapsed >= duration;
      var ret;

      ret = callback(elapsed, duration, complete);
      if (complete || (typeof ret != 'undefined' && (! ret))) {
        tween.stop();
      }
    });
  };

  /*
  # Easing functions

  sourced from Robert Penner's excellent work:
  http://www.robertpenner.com/easing/

  Functions follow the function format of fn(t, b, c, d, s) where:
  - t = time
  - b = beginning position
  - c = change
  - d = duration
  */
  easingFns = animator.easing = {
    linear: function(t, b, c, d) {
      return c*t/d + b;
    },

    /* back easing functions */

    backin: function(t, b, c, d) {
      return c*(t/=d)*t*((BACK_S+1)*t - BACK_S) + b;
    },

    backout: function(t, b, c, d) {
      return c*((t=t/d-1)*t*((BACK_S+1)*t + BACK_S) + 1) + b;
    },

    /*
    backinout: function(t, b, c, d) {
      return ((t/=d/2)<1) ? c/2*(t*t*(((BACK_S*=(1.525))+1)*t-BACK_S))+b : c/2*((t-=2)*t*(((BACK_S*=(1.525))+1)*t+BACK_S)+2)+b;
    },
    */

    /* bounce easing functions */

    bouncein: function(t, b, c, d) {
      return c - easingFns.bounceout(d-t, 0, c, d) + b;
    },

    bounceout: function(t, b, c, d) {
      if ((t/=d) < (1/2.75)) {
        return c*(7.5625*t*t) + b;
      }
      else if (t < (2/2.75)) {
        return c*(7.5625*(t-=(1.5/2.75))*t + 0.75) + b;
      }
      else if (t < (2.5/2.75)) {
        return c*(7.5625*(t-=(2.25/2.75))*t + 0.9375) + b;
      }
      else {
        return c*(7.5625*(t-=(2.625/2.75))*t + 0.984375) + b;
      }
    },

    bounceinout: function(t, b, c, d) {
      if (t < d/2) {
        return easingFns.bouncein(t*2, 0, c, d) / 2 + b;
      }
      else {
        return easingFns.bounceout(t*2-d, 0, c, d) / 2 + c/2 + b;
      }
    },

    /* cubic easing functions */

    cubicin: function(t, b, c, d) {
      return c*(t/=d)*t*t + b;
    },

    cubicout: function(t, b, c, d) {
      return c*((t=t/d-1)*t*t + 1) + b;
    },

    cubicinout: function(t, b, c, d) {
      if ((t/=d/2) < 1) {
        return c/2*t*t*t + b;
      }

      return c/2*((t-=2)*t*t + 2) + b;
    },

    /* elastic easing functions */

    elasticin: function(t, b, c, d, a, p) {
      var s;

      if (t==0) {
        return b;
      }

      if ((t/=d)==1) {
        return b+c;
      }

      if (!p) {
        p=d*0.3;
      }

      if (!a || a < abs(c)) {
        a=c; s=p/4;
      }
      else {
        s = p/TWO_PI * asin (c/a);
      }

      return -(a*pow(2,10*(t-=1)) * sin( (t*d-s)*TWO_PI/p )) + b;
    },

    elasticout: function(t, b, c, d, a, p) {
      var s;

      if (t==0) {
        return b;
      }

      if ((t/=d)==1) {
        return b+c;
      }

      if (!p) {
        p=d*0.3;
      }

      if (!a || a < abs(c)) {
        a=c; s=p/4;
      }
      else {
        s = p/TWO_PI * asin (c/a);
      }

      return a*pow(2,-10*t) * sin( (t*d-s)*TWO_PI/p ) + c + b;
    },

    elasticinout: function(t, b, c, d, a, p) {
      var s;

      if (t==0) {
        return b;
      }

      if ((t/=d/2)==2) {
        return b+c;
      }

      if (!p) {
        p=d*(0.3*1.5);
      }

      if (!a || a < abs(c)) {
        a=c; s=p/4;
      }
      else {
        s = p/TWO_PI * asin (c/a);
      }

      if (t < 1) {
        return -0.5*(a*pow(2,10*(t-=1)) * sin( (t*d-s)*TWO_PI/p )) + b;
      }

      return a*pow(2,-10*(t-=1)) * sin( (t*d-s)*TWO_PI/p )*0.5 + c + b;
    },

    /* quad easing */

    quadin: function(t, b, c, d) {
      return c*(t/=d)*t + b;
    },

    quadout: function(t, b, c, d) {
      return -c *(t/=d)*(t-2) + b;
    },

    quadinout: function(t, b, c, d) {
      if ((t/=d/2) < 1) {
        return c/2*t*t + b;
      }

      return -c/2 * ((--t)*(t-2) - 1) + b;
    },

    /* sine easing */

    sinein: function(t, b, c, d) {
      return -c * cos(t/d * HALF_PI) + c + b;
    },

    sineout: function(t, b, c, d) {
      return c * sin(t/d * HALF_PI) + b;
    },

    sineinout: function(t, b, c, d) {
      return -c/2 * (cos(Math.PI*t/d) - 1) + b;
    }
  };

  return animator;
}));