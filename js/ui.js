Loader.UI = function()
{
	this.room_name = "Onyema's room";
	this.peer = "host";
	this.max = 8;
	this.listRooms();
	this.createListeners();
	//this.createRoom();
	//this.initHostRoom();
}
Loader.UI.prototype.exitRoom = function()
{
	$('body').html(this.cache);
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
	this.cache	 = $('body').html();
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
Loader.UI.prototype.createRoomDB = function ()
{
			encoded_url = (encodeURI("name="+this.room_name+"&peer="+window.net.peer.id+"&max="+this.max+"&ver="+hx.version))
	console.log(encoded_url);
	window.shit = $.post("http://127.0.0.1:8888/create_room",encoded_url,function(a){
		console.log(a);
	});
}
Loader.UI.prototype.createRoom = function ()
{
	/* tell server **/

	/* **/
	var that = this;
	callbacks = {on_peer_init:function(){that.createRoomDB();that.initHostRoom()},
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
	this.cache = $('body').html();
	$('body').html("<div id='game-view'></div>");
	$('body').css({'padding-top':'10px'});
	/** add host **/
	window.game.createRenderer().startRender();
	new Controller(window.game.createPlayer("host","avatar"));
	window.net.startUpdates();
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

}

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
		that.createRoom();
	});
		
	$('#roomlist-table').on('click', 'tbody tr',function(event) {
				that.selected_room = $(this).attr("peer");
				$(this).addClass('active').siblings().removeClass('active');
				$('#join').attr("disabled", false);
	});
				
		$('#roomlist-table').on('dblclick', 'tbody tr',function(event) {
				that.joinRoom(($(this).attr("peer")))
	});
}
