/* eslint-disable */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Particle2 = require('./Particle.js');

var _Particle3 = _interopRequireDefault(_Particle2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Rocket = function (_Particle) {
    _inherits(Rocket, _Particle);

    function Rocket() {
        _classCallCheck(this, Rocket);

        return _possibleConstructorReturn(this, (Rocket.__proto__ || Object.getPrototypeOf(Rocket)).apply(this, arguments));
    }

    _createClass(Rocket, [{
        key: 'explode',
        value: function explode() {
            var count = Math.random() * 10 + 80;

            var particles = [];
            for (var i = 0; i < count; i++) {
                // emulate 3D effect by using cosine and put more particles in the middle
                var speed = Math.cos(Math.random() * Math.PI / 2) * 15;
                var angle = Math.random() * Math.PI * 2;

                var particle = new _Particle3.default(this.x, this.y, {
                    x: Math.cos(angle) * speed,
                    y: Math.sin(angle) * speed
                }, Math.random() * 0.05 + 0.93, 10, 0.2, this.color, 0.92, true);
                particles.push(particle);
            }
            return particles;
        }
    }, {
        key: 'render',
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


            c.fillStyle = "rgb(255, 200, 0)"; // orange
            c.beginPath();

            // draw several particles for each rocket position
            for (var i = 0; i < 5; i++) {
                var angle = Math.random() * Math.PI * 2,
                    pos = Math.random() * size / 2; // use size like radius
                // draw several 1px particles
                c.arc(x + Math.cos(angle) * pos, y + Math.sin(angle) * pos, 1.2, 0, Math.PI * 2, true);
            }
            c.closePath();
            c.fill();

            c.restore();
        }
    }]);

    return Rocket;
}(_Particle3.default);

exports.default = Rocket;