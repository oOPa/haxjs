"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/** experimental **/

var HaxballUI = function () {
	function HaxballUI() {
		_classCallCheck(this, HaxballUI);
	}

	_createClass(HaxballUI, [{
		key: "load",
		value: function load() {
			this.max = 8;
			this.nick = "DEFAULT NICKNAME";
			this.listRooms();
			this.createListeners();
		}
	}, {
		key: "unload",
		value: function unload() {}
	}, {
		key: "getNick",
		value: function getNick() {
			$('#nick-modal').modal().show();
		}
	}, {
		key: "addPlayer",
		value: function addPlayer(player, nick) {
			p = game.createPlayer(nick, "20");
			game.net.clients.put(player, p);
		}
	}, {
		key: "playerDC",
		value: function playerDC(con) {
			console.log(con);
			game.net.clients.remove(con.peer);
			game.addText("* " + con.metadata + "has left");
		}
	}, {
		key: "joinRoom",

		/** more efficient callbacks needed **/
		value: function joinRoom(host) {
			var that = this;
			callbacks = { on_host_connect: this.initClientRoom,
				on_error: this.hostError
			};
			game.net = new HaxballNet();
			game.net.joinRoom(host, callbacks);
		}
	}, {
		key: "initClientRoom",
		value: function initClientRoom() {
			/** clear old html and place canvas **/
			this.cache = $('body').html();
			$('body').html("<div id='game-view'></div>");
			$('body').css({ 'padding-top': '10px' });
			/** add host **/
			game.renderer = new RendererClient();
			/*!-- !*/
			game.renderer.prototype.startRender();
			console.log(game.ui.nick);
			game.renderer.addPlayer('host', 'host');
			game.renderer.addPlayer(game.net.peer.id, game.ui.nick);
			game.controller = new ControllerClient();
			game.net.startUpdates();
		}
	}, {
		key: "createRoom",
		value: function createRoom() {
			var that = this;
			callbacks = {
				on_peer_init: function on_peer_init() {
					that.createRoomDB();that.initHostRoom();
				},
				on_error: this.hostError,
				on_peer_connect: this.addPlayer,
				on_peer_dc: this.playerDC
			};
			game.net = new HaxballNet();
			game.net.createRoom(callbacks);
		}
	}, {
		key: "sendMessage",
		value: function sendMessage() {
			msg = $("#chat-text").val();
			$("#chat-text").empty();
			console.log(msg);
			game.addText(this.nick + ":" + msg);
		}
	}, {
		key: "initHostRoom",
		value: function initHostRoom() {
			var that = this;
			/** clear old html and place canvas **/
			this.cache = $('body').html();
			$('body').html("<div id='game-view'></div>");
			$('body').css({ 'padding-top': '10px' });
			/** add host **/
			game.createRenderer().startRender();
			//add chat
			var chat_div = document.createElement("div");
			chat_div.classList.add("center-block");
			var c = document.createElement("input");
			c.setAttribute("id", "chat-text");
			var send = document.createElement("button");
			send.appendChild(document.createTextNode("Send"));
			send.setAttribute("id", "chat-send");
			chat_div.appendChild(c);
			chat_div.appendChild(send);
			document.body.appendChild(chat_div);
			$("#chat-send").on('click', function () {
				that.sendMessage();
			});
			new ControllerHost(game.createPlayer(this.nick, "avatar"));
			game.net.startUpdates();
		}
	}, {
		key: "exitRoom",
		value: function exitRoom() {
			$('body').html(this.cache);
			$('body').css({ 'padding-top': '70px' });
			game.net.peer.disconnect();
			this.listRooms();
			this.createListeners();
		}
	}, {
		key: "hostError",

		/** unstable **/
		value: function hostError(err) {
			console.log("unable to create room");
			console.log(err);
		}
	}, {
		key: "createRoomDB",

		/** stable **/
		value: function createRoomDB() {
			$.post("/create_room", encodeURI("name=" + this.room_name + "&peer=" + game.net.peer.id + "&max=" + this.max + "&ver=" + hx.version));
		}
	}, {
		key: "listRooms",
		value: function listRooms() {
			$.getJSON("/get_rooms", function (data) {
				var items = [];

				$.each(data, function (key, val) {
					pass = val.pass ? "Yes" : "No";
					distance = key * 20;
					$('#roomlist-table tbody').append('<tr peer=' + val.peer + ' class=\'clickable-row\'><td>' + val.name + '</td><td>' + val.players + '/' + val.max + '</td><td>' + pass + '</td><td>' + distance + '</td></tr>');
				});
			});
		}
	}, {
		key: "createListeners",
		value: function createListeners() {
			var that = this;
			$('#join').on('click', function () {
				that.joinRoom(that.selected_room);
			});
			$('#refresh').on('click', function () {
				that.listRooms();
			});
			$('#create').on('click', function () {
				$('#room').attr('value', that.nick + "'s room");
				$('#myModal').modal().show();
			});

			$('#roomlist-table').on('click', 'tbody tr', function (event) {
				that.selected_room = $(this).attr("peer");
				$(this).addClass('active').siblings().removeClass('active');
				$('#join').attr("disabled", false);
			});

			$('#roomlist-table').on('dblclick', 'tbody tr', function (event) {
				that.joinRoom($(this).attr("peer"));
			});
			$('#play').on('click', function () {
				that.nick = $('#nick').val();$('#nick-modal').modal('hide');
			});
			$('#create_room_modal').on('click', function () {
				that.room_name = $('#room').val();that.createRoom();
			});
		}
	}]);

	return HaxballUI;
}();