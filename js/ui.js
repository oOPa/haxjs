/** experimental **/
Loader.UI = function()
{
	this.max = 8;
	this.getNick();
	this.listRooms();
	this.createListeners();
}

Loader.UI.prototype.getNick = function()
{
	$('#nick-modal').modal().show();
}
Loader.UI.prototype.addPlayer = function(player)
{
	p = game.createPlayer(player,"20");
	game.net.clients.put(player,p);
}
Loader.UI.prototype.joinRoom = function (host)
{
	var that = this;
	callbacks = {on_host_connect:this.initClientRoom,
				on_error : this.hostError,
				};
	game.net = new Loader.Net();
	game.net.joinRoom(host	,callbacks);
}
Loader.UI.prototype.initClientRoom = function ()
{
	/** clear old html and place canvas **/
	this.cache	 = $('body').html();
	$('body').html("<div id='game-view'></div>");
	$('body').css({'padding-top':'10px'});
	/** add host **/
	game.renderer = new Loader.Client.Renderer();
	/*!-- !*/
	game.renderer.prototype.startRender();
	console.log(game.ui.nick);
	game.renderer .addPlayer('host','host');
	game.renderer .addPlayer(game.net.peer.id,game.ui.nick);
	game.controller = new Loader.Client.Controller();
	game.net.startUpdates();
}


Loader.UI.prototype.createRoom = function ()
{
	var that = this;
	callbacks = {
		on_peer_init:function(){that.createRoomDB();that.initHostRoom()},
		on_error : this.hostError,
		on_peer_connect : this.addPlayer
	};
	game.net = new Loader.Net();
	game.net.createRoom(callbacks);
}

Loader.UI.prototype.initHostRoom = function ()
{
	/** clear old html and place canvas **/
	this.cache = $('body').html();
	$('body').html("<div id='game-view'></div>");
	$('body').css({'padding-top':'10px'});
	/** add host **/
	game.createRenderer().startRender();
	new Loader.Host.Controller(game.createPlayer(this.nick,"avatar"));
	game.net.startUpdates();
}
Loader.UI.prototype.exitRoom = function()
{
	$('body').html(this.cache);
	$('body').css({'padding-top':'70px'});
	game.net.peer.disconnect();
	this.listRooms();
	this.createListeners();
}
/** unstable **/
Loader.UI.prototype.hostError = function (err)
{
	console.log("unable to create room");
	console.log(err);
}
/** stable **/

Loader.UI.prototype.createRoomDB = function ()
{
	$.post("/create_room",encodeURI("name="+this.room_name+"&peer="+game.net.peer.id+"&max="+this.max+"&ver="+hx.version));
}
Loader.UI.prototype.listRooms = function()
{
	$.getJSON( "/get_rooms", function( data ) {
	var items = [];

		$.each( data, function( key, val ) {
			pass = val.pass ? "Yes" : "No";
			distance = key * 20;
			$('#roomlist-table tbody').append('<tr peer='+val.peer+' class=\'clickable-row\'><td>'+val.name+'</td><td>'+val.players+'/'+val.max+'</td><td>'+pass+'</td><td>'+distance+'</td></tr>');
		});
	})

};

Loader.UI.prototype.createListeners = function()
{
	var that = this;
	$('#join').on('click',function(){
		that.joinRoom(that.selected_room)
	});
	$('#refresh').on('click',function(){
		that.listRooms();
	});
	$('#create').on('click',function(){
		$('#room').attr('value',that.nick + "'s room");
		$('#myModal').modal().show();
	});
		
	$('#roomlist-table').on('click', 'tbody tr',function(event) {
				that.selected_room = $(this).attr("peer");
				$(this).addClass('active').siblings().removeClass('active');
				$('#join').attr("disabled", false);
	});
				
		$('#roomlist-table').on('dblclick', 'tbody tr',function(event) {
				that.joinRoom(($(this).attr("peer")))
	});
	$('#play').on('click',function(){
		that.nick=$('#nick').val();$('#nick-modal').modal('hide')
	})
	$('#create_room_modal').on('click',function(){
		that.room_name= $('#room').val();that.createRoom();
	});
}
