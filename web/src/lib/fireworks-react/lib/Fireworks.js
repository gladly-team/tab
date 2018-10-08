/* eslint-disable */
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Rocket = require('./components/Rocket.js');

var _Rocket2 = _interopRequireDefault(_Rocket);

var _Smoke = require('./components/Smoke.js');

var _Smoke2 = _interopRequireDefault(_Smoke);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var MAX_PARTICLES = 400;
var FIRE_ROCKET_EVERY_MS = 400;
var REFRESH_EVERY_MS = 40;
var DEFAULT_BACKGROUND_COLOR = "rgba(0, 0, 0, 0.02)";

var Fireworks = function (_Component) {
    _inherits(Fireworks, _Component);

    function Fireworks() {
        _classCallCheck(this, Fireworks);

        return _possibleConstructorReturn(this, (Fireworks.__proto__ || Object.getPrototypeOf(Fireworks)).apply(this, arguments));
    }

    _createClass(Fireworks, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            var _this2 = this;

            var canvas = this.canvas;
            var _props = this.props,
                width = _props.width,
                height = _props.height,
                background = _props.background;


            this.fireworksContext = canvas.getContext('2d');

            this.fireworksContext.fillStyle = background ? background : DEFAULT_BACKGROUND_COLOR;
            this.fireworksContext.fillRect(0, 0, width + 'px', height + 'px');

            var rockets = [],
                particles = [];
            this.launchInterval = window.setInterval(function () {
                return rockets = _this2.launch.call(_this2, width, height, rockets);
            }, FIRE_ROCKET_EVERY_MS);
            this.loopInterval = window.setInterval(function () {
                var _loop$call, _loop$call2;

                return _loop$call = _this2.loop.call(_this2, width, height, rockets, particles), _loop$call2 = _slicedToArray(_loop$call, 2), rockets = _loop$call2[0], particles = _loop$call2[1], _loop$call;
            }, REFRESH_EVERY_MS);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.clearInterval(this.launchInterval);
            window.clearInterval(this.loopInterval);
        }
    }, {
        key: 'shouldAddSmoke',
        value: function shouldAddSmoke(rocket) {
            var _rocket$getPosition = rocket.getPosition(),
                _rocket$getPosition2 = _slicedToArray(_rocket$getPosition, 2),
                x = _rocket$getPosition2[0],
                y = _rocket$getPosition2[1];

            return Math.random() < 0.6 ? [new _Smoke2.default(x, y, {
                x: Math.random() * 1 - 0.5,
                y: Math.random() * 0.01
            }, 1.03, 1, -0.2, undefined, 0.01, true, 1, Math.random() * 0.03 + 0.02)] : [];
        }
    }, {
        key: 'loop',
        value: function loop(width, height, rockets, particles) {
            var _this3 = this;

            // clear canvas
            this.fireworksContext.fillRect(0, 0, width, height);

            var existingRockets = [];
            var existingParticles = [].concat(_toConsumableArray(particles));

            rockets.forEach(function (rocket) {
                // update and render
                rocket.update();
                rocket.render(_this3.fireworksContext);

                existingParticles = [].concat(_toConsumableArray(existingParticles), _toConsumableArray(_this3.shouldAddSmoke(rocket)));

                // random chance of 1% if rockets is above the middle
                var randomChance = rocket.y < height * 2 / 3 ? Math.random() * 100 <= 1 : false;

                /* Explosion rules
                    - 80% of screen
                    - going down
                    - close to x, y position of rocket location
                    - 1% chance of random explosion
                */
                rocket.y < height / 5 || rocket.vel.y >= 0 || randomChance ? existingParticles = [].concat(_toConsumableArray(existingParticles), _toConsumableArray(rocket.explode())) : existingRockets.push(rocket);
            });

            //        let existingParticles = [];

            existingParticles.forEach(function (particle) {
                particle.update();

                // render and save particles that can be rendered
                if (particle.exists()) {
                    particle.render(_this3.fireworksContext);
                    existingParticles.push(particle);
                }
            });

            while (existingParticles.length > MAX_PARTICLES) {
                existingParticles.shift();
            }

            return [existingRockets, existingParticles];
        }
    }, {
        key: 'launch',
        value: function launch(width, height, rockets) {
            return this.launchFrom(width / 2, height, rockets);
        }
    }, {
        key: 'launchFrom',
        value: function launchFrom(x, y, rockets) {
            var result = [].concat(_toConsumableArray(rockets));

            if (result.length < 10) {
                var rocket = new _Rocket2.default(x, y, {
                    x: Math.random() * 6 - 3,
                    y: Math.random() * -3 - 4
                }, 0.999, 8, 0.01, Math.floor(Math.random() * 360 / 10) * 10);
                result.push(rocket);
            }
            return result;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var _props2 = this.props,
                width = _props2.width,
                height = _props2.height,
                style = _props2.style;

            return _react2.default.createElement('canvas', { ref: function ref(c) {
                    _this4.canvas = c;
                }, width: width, height: height, style: style });
        }
    }]);

    return Fireworks;
}(_react.Component);

Fireworks.propTypes = {
    width: _propTypes2.default.number.isRequired,
    height: _propTypes2.default.number.isRequired,
    background: _propTypes2.default.string
};

exports.default = Fireworks;