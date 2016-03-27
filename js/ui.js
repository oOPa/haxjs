Loader.UI = function()
{
	//this.listRooms();
	//this.initTable();
	this.createRoom();
	this.initHostRoom();
}
Loader.UI.prototype.exitRoom = function()
{
	//html lowercase
	//window.originalHTMl = $('body').html();
	$('body').html(window.originalHTMl);
	$('body').css({'padding-top':'70px'});
		this.initListeners();

	//window.game.createRenderer().startRender();
}
Loader.UI.prototype.joinRoom = function (host)
{
	var that = this;
	callbacks = {on_host_connect:this.initClientRoom,
				on_error : this.hostError
	};
	window.net = new Loader.Net();
	window.net.joinRoom(host	,callbacks);
}
Loader.UI.prototype.initClientRoom = function ()
{
	window.game.createRenderer().startRenderer();
}
Loader.UI.prototype.createRoom = function ()
{
	var that = this;
	callbacks = {on_peer_connect:this.initHostRoom,
				on_error : this.hostError
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
	console.log("ssss");
	window.originalHTMl = $('body').html();
	$('body').html("<div id='game-view'></div>");
	$('body').css({'padding-top':'10px'});
	window.game.createRenderer().startRender();
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
Loader.UI.prototype.initListeners = function()
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
