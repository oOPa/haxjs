Loader.UI = function()
{
	this.listRooms();
	this.createListeners();
	//this.createRoom();
	//this.initHostRoom();
}
Loader.UI.prototype.exitRoom = function()
{
	$('body').html(window.originalHTML);
	$('body').css({'padding-top':'70px'});
	window.net.peer.disconnect();
	this.listRooms();
	this.createListeners();
}
Loader.UI.prototype.addPlayer = function(player)
{
	p = window.game.createPlayer(player,"20");
	window.net.clients.put(player,p);
}
Loader.UI.prototype.joinRoom = function (host)
{
	var that = this;
	callbacks = {on_host_connect:this.initClientRoom,
				on_error : this.hostError,
				};
	window.net = new Loader.Net();
	window.net.joinRoom(host	,callbacks);
}
Loader.UI.prototype.initClientRoom = function ()
{
	/** clear old html and place canvas **/
	window.originalHTML	 = $('body').html();
	$('body').html("<div id='game-view'></div>");
	$('body').css({'padding-top':'10px'});
	/** add host **/
	//window.game.createRenderer().startRender();
	//window.game.renderer = new Renderer();
	//window.game.renderer.startRender();
	window.renderer = window.game.renderer = new NetRenderer();
	window.game.renderer.prototype.startRender();
	//new Controller(window.game.createPlayer(net.peer.id,"avatar"));
	window.renderer.addPlayer('host');
	window.renderer.addPlayer(net.peer.id);
	window.controller = new NetController();
	window.net.startUpdates();
}
Loader.UI.prototype.createRoom = function ()
{
	var that = this;
	callbacks = {on_peer_init:this.initHostRoom,
				on_error : this.hostError,
				on_peer_connect : this.addPlayer
	};
	window.net = new Loader.Net();
	window.net.createRoom(callbacks);
}
Loader.UI.prototype.hostError = function (err)
{
	console.log("unable to create room");
	console.log(err);
}
Loader.UI.prototype.initHostRoom = function ()
{
	/** clear old html and place canvas **/
	window.originalHTML	 = $('body').html();
	$('body').html("<div id='game-view'></div>");
	$('body').css({'padding-top':'10px'});
	/** add host **/
	window.game.createRenderer().startRender();
	new Controller(window.game.createPlayer("host","avatar"));
	window.net.startUpdates();
}
Loader.UI.prototype.listNet = function()
{
	$.getJSON( "/get_rooms", function( data ) {
	var items = [];

		$.each( data, function( key, val ) {
			pass = val.pass ? "Yes" : "No";
			distance = key * 20;
			$('#roomlist-table tbody').append('<tr class=\'clickable-row\'><td>'+val.name+'</td><td>'+val.players+'/'+val.max+'</td><td>'+pass+'</td><td>'+distance+'</td></tr>');
		});
	})

}
Loader.UI.prototype.listRooms = function()
{
	rooms = window.roomlist.rooms;
	for(i in rooms)
	{
		room = rooms[i];
		pass = room.pass ? "Yes" : "No";
		distance = i * 20;
		$('#roomlist-table tbody').append('<tr class=\'clickable-row\'><td>'+room.name+'</td><td>'+room.players+'/'+room.maxplayers+'</td><td>'+pass+'</td><td>'+distance+'</td></tr>');
	}
}
Loader.UI.prototype.createListeners = function()
{
	var that = this;
	$('#join').on('click',function(){
		that.joinRoom(window.roomlist.rooms[that.room_index])
	});
	$('#refresh').on('click',function(){
		that.listRooms();
	});
	$('#create').on('click',function(){
		that.createRoom();
	});
		
	$('#roomlist-table').on('click', 'tbody tr',function(event) {
		that.room_index = $(this).closest('tr').index()
				$(this).addClass('active').siblings().removeClass('active');
				$('#join').attr("disabled", false);
	});
				
		$('#roomlist-table').on('dblclick', 'tbody tr',function(event) {
				room_index = $(this).closest('tr').index()
				that.joinRoom(window.roomlist.rooms[room_index])
	});
}
