const animator = require('..');
const crel = require('crel');

window.addEventListener('DOMContentLoaded', () => {
  const buttonContainer = crel('div');
  const easingTypeSelect = crel('select');
  const btnAnimate = crel('button', 'animate');
  const easingTypes = Object.keys(animator.easing);

  const canvas = crel('canvas', {
    width: 600,
    height: 600
  });

  easingTypes.forEach(easingType => {
    const opt = crel('option');

    opt.text = easingType;
    easingTypeSelect.add(opt, null);
  });

  btnAnimate.addEventListener('click', () => {
    const easingType = easingTypes[easingTypeSelect.selectedIndex];
    const context = canvas.getContext('2d');
    const easeFn = animator.easing[easingType];

    animator.tween(function(elapsed, duration, complete) {
      const x = easeFn(elapsed, 100, 400, duration);
      const y = easeFn(elapsed, 100, 400, duration);

      // NOTE: clear rect is so slow...
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillRect(x, y, 10, 10);
    }, 1500);
  });

  buttonContainer.appendChild(easingTypeSelect);
  buttonContainer.appendChild(btnAnimate);

  // create the canvas
  document.body.appendChild(buttonContainer);
  document.body.insertBefore(canvas, buttonContainer);
});

