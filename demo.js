var animator = require('./'),
    easing = require('./easing'),
    crel = require('crel'),
    animations,
    canvas,
    context;

function drawani(canvas, easingType) {
    var context = canvas.getContext('2d'),
        easeFn = easing[easingType],
        x, y;

    animator.tween(function(elapsed, duration, complete) {
        x = easeFn(elapsed, 100, 400, duration);
        y = easeFn(elapsed, 100, 400, duration);

        // NOTE: clear rect is so slow...
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillRect(x, y, 10, 10);
    }, 1500);
}

window.addEventListener('load', function() {
    var buttonContainer = document.getElementById('easing-types'),
        easingTypeSelect = crel('select'),
        btnAnimate = crel('button', 'animate'),
        easingTypes = Object.keys(easing),
        canvas;

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
    document.body.insertBefore(canvas = crel('canvas', {
        width: 600,
        height: 600
    }), buttonContainer);
});

