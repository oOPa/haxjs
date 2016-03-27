function loadRooms()
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
function enterRoom(host)
{
	$("#roomlist").addClass("hide");
	var peer = new Peer({host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
	}); 

	var conn = peer.connect('host');
	
	conn.on('open', function(){
	console.log("connected to host!");
		var game = window.game = new Loader();
		var r=game.createRenderer();
		new Controller(game.createPlayer(peer.id,20));
		r.startRender();
	});
conn.on('data',function(dataConnection){
	/** on receive data from host **/
});


}
var createRoom = function()
{
	$("#roomlist").addClass("hide");
	var peer = new Peer('host',{host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});

	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		console.log('waiting for connections');
		var game = window.game = new Loader();
		var r=game.createRenderer();
		new Controller(game.createPlayer("host",20));
		r.startRender();
	}); 

	peer.on('connection', function(dataConnection) { 
		console.log("new peer "+dataConnection.peer+" connected");
		dataConnection.on('close',function(){console.log("DC");var that=this;window.game.addText(that.peer + "has disconnected")});
		
		//console.log();
		window.game.createPlayer(dataConnection.peer,20);
		window.game.addText(dataConnection.peer + "has joined");
		dataConnection.on('data',function(data){
			
	});
	
	//peer.on('disconnected', function() {});

	});
}
