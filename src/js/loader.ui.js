export class HaxballUI{
	 constructor() {
		 console.log(this);
		 this.load();
	 }
	load()
	{
		this.max = 8;
		this.nick = "DEFAULT NICKNAME";
		this.listRooms();
		this.createListeners();	
	};
}
class hb{	
unload()
{
	
}
getNick()
{
	$('#nick-modal').modal().show();
}
addPlayer (player,nick)
{
	p = haxball.createPlayer(nick,"20");
	haxball.net.clients.put(player,p);
}
playerDC (con)
{
	console.log(con);
	haxball.net.clients.remove(con.peer);
	haxball.addText("* "+con.metadata+"has left");
}
/** more efficient callbacks needed **/
joinRoom (host)
{
	var that = this;
	let callbacks = {on_host_connect:this.initClientRoom,
				on_error : this.hostError
				};
	haxball.net = new Net();
	haxball.net.joinRoom(host	,callbacks);
}
initClientRoom ()
{
	/** clear old html and place canvas **/
	this.cache	 = $('body').html();
	$('body').html("<div id='game-view'></div>");
	$('body').css({'padding-top':'10px'});
	/** add host **/
	haxball.renderer = new ClientRenderer();
	/*!-- !*/
	haxball.renderer.prototype.startRender();
	console.log(haxball.ui.nick);
	haxball.renderer .addPlayer('host','host');
	haxball.renderer .addPlayer(haxball.net.peer.id,haxball.ui.nick);
	haxball.controller = new ControllerClient();
	haxball.net.startUpdates();
}

createRoom ()
{
	/** use promises */
	var that = this;
	
	let callbacks = {
		on_peer_init:function(){that.createRoomDB();that.initHostRoom()},
		on_error : this.hostError,
		on_peer_connect : this.addPlayer,
		on_peer_dc : this.playerDC
	};
	haxball.net = new Net();
	haxball.net.createRoom(callbacks);
}
sendMessage ()
{
	msg = $("#chat-text").val();
	$("#chat-text").empty();
	console.log(msg);	
	haxball.addText(this.nick+":"+msg);
}
initHostRoom ()
{
	var that = this;
	/** clear old html and place canvas **/
	this.cache = $('body').html();
	$('body').html("<div id='game-view'></div>");
	$('body').css({'padding-top':'10px'});
	/** add host **/
	haxball.createRenderer().startRender();
	//add chat
	var chat_div = document.createElement("div");
	chat_div.classList.add("center-block")
	var c = document.createElement("input");
	c.setAttribute("id","chat-text");
	var send = document.createElement("button");
	send.appendChild(document.createTextNode("Send"));
	send.setAttribute("id","chat-send");
	chat_div.appendChild(c);
	chat_div.appendChild(send);
	document.body.appendChild(chat_div);
	$("#chat-send").on('click',function(){
		that.sendMessage();
	});
	new ControllerHost(haxball.createPlayer(this.nick,"avatar"));
	haxball.net.startUpdates();
}
exitRoom()
{
	$('body').html(this.cache);
	$('body').css({'padding-top':'70px'});
	haxball.net.peer.disconnect();
	this.listRooms();
	this.createListeners();
}
/** unstable **/
hostError (err)
{
	console.log("unable to create room");
	console.log(err);
}
/** stable **/
createRoomDB  ()
{
	$.post("/create_room",encodeURI("name="+this.room_name+"&peer="+haxball.net.peer.id+"&max="+this.max+"&ver="+hx.version));
}
listRooms ()
{
	$.getJSON( "/get_rooms", function( data ) {
	var items = [];
		$.each( data, function( key, val ) {
			var pass = val.pass ? "Yes" : "No";
			var distance = key * 20;
			$('#roomlist-table tbody').append('<tr peer='+val.peer+' class=\'clickable-row\'><td>'+val.name+'</td><td>'+val.players+'/'+val.max+'</td><td>'+pass+'</td><td>'+distance+'</td></tr>');
		});
	})

}
createListeners ()
{
	var that = this;
	$('#join').on('click',function(){
		that.joinRoom(that.selected_room);
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
				that.joinRoom(($(this).attr("peer")));
	});
	$('#play').on('click',function(){
		that.nick=$('#nick').val();$('#nick-modal').modal('hide');
	})
	$('#create_room_modal').on('click',function(){
		that.room_name= $('#room').val();that.createRoom();
	});
}
}

export function sum(x,y)
{
	return x+y;
}