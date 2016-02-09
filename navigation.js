var play = function()
{
	nick = document.getElementById("nickname-text").value;
	if(nick.length >0)
	{
		$(".login").css({"display" : "none"})
		/** load room list **/
		//$(".load-roomlist").css({"display" : "inline"})
		
		$('#roomlist').append("<button onclick='loadRooms()'>Refresh<button");
		//$('#roomlist').append("<button>Join Room<button");
		$('#roomlist').append("<button onclick='createRoom()'>Create Room<button");
		//$(".roomlist").css({"display" : "inline",'background-color':'#3c312b'})
		$("#roomlist").removeClass("hide");
		$("#roomlist").addClass("roomlist");
	}
}
function loadRooms()
{
	list = {
	ver:0.1,
	rooms : [
	{
		ver :0.1,
		host : "host",
		name : "02323",
		players : 0,
		maxplayers : 8,
		pass : 0,
		country : 'gb',
		lat : 0,
		longitude :0
	},
		{
		ver :0.1,
		host : "00000",
		name : "02323",
		players : 0,
		maxplayers : 8,
		pass : 0,
		country : 'gb',
		lat : 0,
		longitude :0
	},
		{
		ver :0.1,
		host : "00000",
		name : "02323",
		players : 0,
		maxplayers : 8,
		pass : 0,
		country : 'gb',
		lat : 0,
		longitude :0
	},
		{
		ver :0.1,
		host : "00000",
		name : "02323",
		players : 0,
		maxplayers : 8,
		pass : 0,
		country : 'gb',
		lat : 0,
		longitude :0
	},
		{
		ver :0.1,
		host : "00000",
		name : "02323",
		players : 0,
		maxplayers : 8,
		pass : 0,
		country : 'gb',
		lat : 0,
		longitude :0
	}	
	]
};
		rooms = list.rooms;
		for(i in rooms)
		{
			room = rooms[i];
			pass = room.pass ? "Yes" : "No";
			distance = i * 20;
			$('#roomlist-table tbody').append('<tr onclick="enterRoom(\''+room.host+'\')"><td>'+room.name+'</td><td>'+room.players+'/'+room.maxplayers+'</td><td>'+pass+'</td><td>'+distance+'</td></tr>');
		}
}
function enterRoom(host)
{
	$("#roomlist").addClass("hide");
	//create canvas
	/**
	$('#game-view').append($('<canvas>').attr({
		'id' : 'haxball',
		'height': '200',
		'width' : '500'
	}));
	**/
	
	var peer = new Peer({host : "haxjs.cloudapp.net",path:"/api",port:80,key:"peerjs"});
	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
	}); 

	var conn = peer.connect('host');
	
	conn.on('open', function(){
	console.log("connected to host!");
	window.game = new Loader();
	});
conn.on('data',function(dataConnection){
	/** on receive data from host **/
});


	
}
var createRoom = function()
{
	$("#roomlist").addClass("hide");
	var peer = new Peer('host',{host : "haxjs.cloudapp.net",path:"/api",port:80,key:"peerjs"});

	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		console.log('waiting for connections');
		window.game = new Loader();
	}); 

	peer.on('connection', function(dataConnection) { 
		console.log("new peer "+dataConnection.peer+" connected");
		dataConnection.on('close',function(){console.log("DC");var that=this;window.game.addText(that.peer + "has disconnected")});
		
		//console.log();
		window.game.addPlayer(dataConnection.peer,20);
		window.game.addText(dataConnection.peer + "has joined");
		dataConnection.on('data',function(data){
			
	});
	
	//peer.on('disconnected', function() {});

	});
}
