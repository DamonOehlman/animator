var animator = require('..');
var crel = require('crel');
var animations;
var canvas;
var context;

function drawani(canvas, easingType) {
  var context = canvas.getContext('2d');
  var easeFn = animator.easing[easingType];
  var x;
  var y;

  animator.tween(function(elapsed, duration, complete) {
    x = easeFn(elapsed, 100, 400, duration);
    y = easeFn(elapsed, 100, 400, duration);

    // NOTE: clear rect is so slow...
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(x, y, 10, 10);
  }, 1500);
}

window.addEventListener('load', function() {
  var buttonContainer = crel('div');
  var easingTypeSelect = crel('select');
  var btnAnimate = crel('button', 'animate');
  var easingTypes = Object.keys(animator.easing);
  var canvas;

  easingTypes.forEach(function(easingType) {
    var opt = crel('option');

    opt.text = easingType;
    easingTypeSelect.add(opt, null);
  });

  btnAnimate.addEventListener('click', function() {
    drawani(canvas, easingTypes[easingTypeSelect.selectedIndex]);
  });

  buttonContainer.appendChild(easingTypeSelect);
  buttonContainer.appendChild(btnAnimate);

  // create the canvas
  document.body.appendChild(buttonContainer);
  document.body.insertBefore(canvas = crel('canvas', {
    width: 600,
    height: 600
  }), buttonContainer);
});

