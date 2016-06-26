var HaxballUI = function()
{
	this.load();
}
HaxballUI.prototype.load = function()
{
	this.max = 8;
	this.nick = "DEFAULT NICKNAME";
	this.listRooms();
	this.createListeners();	
};
//rename this function
HaxballUI.prototype.getNick = function()
{
	$('#nick-modal').modal().show();
}

HaxballUI.prototype.playerDC =function (con)
{
	haxball.logger.log(con);
	this.net.clients.remove(con.peer);
	haxball.logger.log("* "+con.metadata+"has left");
}
HaxballUI.prototype.joinRoom =function(host)
{
	var that = this;
	this.net = new Net();
	var join = new Promise(function(resolve,reject	){
		that.net.joinRoom(host,resolve,reject);
	});
	join.then(function(e){
		that.initClientRoom.call(that);
	});
	join.catch(function(e)
	{
		that.hostError(that,e);	
	});
}
HaxballUI.prototype.initClientRoom = function ()
{
	this.placeCanvas();
	haxball.createRenderer().startRender();
	//actually add host
	//haxball.renderer.addPlayer(new NetPlayer('host','host'));
	haxball.createPlayer (window.host.peer,window.host.peer,window.host.peer);
	new Controller(haxball.createPlayer(this.nick,this.nick,this.net.peer));
	haxball.net.startUpdates.apply();
}

HaxballUI.prototype.createRoom =function()
{
	var that = this;
	this.net = new Net();
	var p = new Promise(function(resolve,reject){
		that.net.createRoom();
	});	
	p.then(function(){
		that.createRoomDB();
		that.initHostRoom()
	});
	p.catch(function(err){
		
		//on_error : this.hostError,
		//on_peer_connect : this.addPlayer,
		//on_peer_dc : this.playerDC
	});

	
	haxball.net.createRoom(callbacks);
}
HaxballUI.prototype.placeCanvas = function()
{
	/** clear old html and place canvas **/
	this.cache = $('body').html();
	$('body').html("<div id='game-view'></div>");
	$('body').css({'padding-top':'10px'});
}
HaxballUI.prototype.sendMessage=function ()
{
	msg = $("#chat-text").val();
	$("#chat-text").empty();
	console.log(msg);	
	haxball.addText(this.nick+":"+msg);
}
HaxballUI.prototype.initHostRoom =function()
{
	var that = this;
	this.placeCanvas();
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
	new Controller(haxball.createPlayer(this.nick,"avatar","host"));
	that.net.startUpdates.apply();
}
HaxballUI.prototype.exitRoom =function()
{
	$('body').html(this.cache);
	$('body').css({'padding-top':'70px'});
	this.net.peer.disconnect();
	this.listRooms();
	this.createListeners();
}
/** unstable **/
HaxballUI.prototype.hostError=function (err)
{
	console.log("unable to create room");
	console.log(err);
}
/** stable **/
HaxballUI.prototype.createRoomDB =function ()
{
	$.post("/create_room",encodeURI("name="+this.room_name+"&peer="+this.net.peer.id+"&max="+this.max+"&ver="+hx.version));
}
HaxballUI.prototype.listRooms =function()
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
HaxballUI.prototype.createListeners=function ()
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

