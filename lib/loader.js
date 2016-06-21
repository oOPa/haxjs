"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Haxball = function () {
			function Haxball() {
						_classCallCheck(this, Haxball);

						this.players = [];
						this.logger = new HaxballLogger();
						this.physics = new HaxballPhysics();
			}

			_createClass(Haxball, [{
						key: "render",
						value: function render() {
									for (i in this.players) {
												item = this.players[i];
												item.update();
									}
									this.physics.update();
						}
			}, {
						key: "createRenderer",
						value: function createRenderer() {
									return this.renderer = new HaxballRenderer(this.render);
						}
			}, {
						key: "createPlayer",
						value: function createPlayer() {
									var player = new Loader.Host.Player(name, avatar, this.physics.world);
									this.players.push(player);
									if (typeof this.renderer != 'undefined') {
												this.renderer.addPlayer(player);
									}
									this.addText("* " + player.name + " was moved to red");
									return player;
						}
			}, {
						key: "buildBall",
						value: function buildBall() {
									var ball = new Loader.Physics.DefaultBall(this.physics.world);
									this.renderer.addBall(ball);
						}
			}, {
						key: "addText",
						value: function addText(txt) {
									this.logger.addChat(txt);
						}
			}]);

			return Haxball;
}();

;

Loader.Host = {};
Loader.Client = {};