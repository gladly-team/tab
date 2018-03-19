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

var Smoke = function (_Particle) {
    _inherits(Smoke, _Particle);

    function Smoke() {
        _classCallCheck(this, Smoke);

        return _possibleConstructorReturn(this, (Smoke.__proto__ || Object.getPrototypeOf(Smoke)).apply(this, arguments));
    }

    _createClass(Smoke, [{
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


            var gradient = c.createRadialGradient(x, y, 0.1, x, y, size / 2);
            gradient.addColorStop(0.1, "rgba(200, 200, 200," + this.alpha + ")");
            gradient.addColorStop(1, "rgba(150, 150, 150 ," + this.alpha + ")");

            c.fillStyle = gradient;

            c.beginPath();
            c.arc(x, y, size, 0, Math.PI * 2, true);
            c.lineTo(x, y);
            c.closePath();
            c.fill();

            c.restore();
        }
    }]);

    return Smoke;
}(_Particle3.default);

exports.default = Smoke;