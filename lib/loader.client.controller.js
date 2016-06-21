'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ControllerClient = function () {
    function ControllerClient() {
        _classCallCheck(this, ControllerClient);

        this.keys = [false, false, false, false];
        this.Directions = hx.constants.Directions;
        this.addActionListeners();
    }

    _createClass(ControllerClient, [{
        key: 'addActionListeners',
        value: function addActionListeners() {
            document.addEventListener('keydown', function (e) {
                if (e.keyCode > 36 && e.keyCode < 41) {
                    that.keys[that.Directions[e.keyCode]] = true;
                    console.log(e.keyCode);
                }
            });
            document.addEventListener('keyup', function (e) {
                that.keys[that.Directions[e.keyCode]] = false;
                console.log(e.keyCode);
            });
        }
    }]);

    return ControllerClient;
}();