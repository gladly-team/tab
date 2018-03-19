/* eslint-disable */
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Particle = function () {
    function Particle() {
        var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
        var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
        var vel = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { x: 0, y: 0 };
        var shrink = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0.97;
        var size = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 2;
        var gravity = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;
        var color = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : 0;
        var resistance = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;
        var flick = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : false;
        var alpha = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : 1;
        var fade = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 0;

        _classCallCheck(this, Particle);

        this.x = x;
        this.y = y;
        this.vel = vel;
        this.shrink = shrink;
        this.size = size;
        this.gravity = gravity;
        this.color = color;
        this.resistance = resistance;
        this.flick = flick;
        this.alpha = alpha;
        this.fade = fade;
    }

    _createClass(Particle, [{
        key: "getPosition",
        value: function getPosition() {
            return [this.x, this.y];
        }
    }, {
        key: "update",
        value: function update() {
            // apply resistance
            this.vel.x *= this.resistance;
            this.vel.y *= this.resistance;

            // gravity down
            this.vel.y += this.gravity;

            // update position based on speed
            this.x += this.vel.x;
            this.y += this.vel.y;

            // shrink
            this.size *= this.shrink;

            // fade out
            this.alpha -= this.fade;
        }
    }, {
        key: "render",
        value: function render(c) {
            if (!this.exists()) {
                return;
            }

            c.save();

            c.globalCompositeOperation = 'lighter';

            var _ref = [this.x, this.y, this.size],
                x = _ref[0],
                y = _ref[1],
                size = _ref[2];


            var gradient = c.createRadialGradient(x, y, 0.1, x, y, size / 2);
            gradient.addColorStop(0.1, "rgba(255,255,255," + this.alpha + ")");
            gradient.addColorStop(0.8, "hsla(" + this.color + ", 100%, 50%, " + this.alpha + ")");
            gradient.addColorStop(1, "hsla(" + this.color + ", 100%, 50%, 0.1)");

            c.fillStyle = gradient;

            c.beginPath();
            c.arc(x, y, this.flick ? Math.random() * size : size, 0, Math.PI * 2, true);
            c.closePath();
            c.fill();

            c.restore();
        }
    }, {
        key: "exists",
        value: function exists() {
            return this.alpha >= 0.1 && this.size >= 1;
        }
    }]);

    return Particle;
}();

exports.default = Particle;