//var peer = new Peer({key: 'dlsz9588ud3rf6r'});
//var peer = new Peer({key: 'uudkizxc7pl4ygb9'});
var peer = new Peer('host',{host : "haxjs.cloudapp.net",port:80,key:"peerjs"});

peer.on('open', function(id) {
	console.log('My peer ID is: ' + id);
	console.log('waiting for connections');
}); 

peer.on('connection', function(dataConnection) { 
	console.log("new peer "+dataConnection.peer+" connected");
	//create new player
	var player = new hx.Player(window.hxp.world);
	window.hxp.players.push(player);
	dataConnection.on('data',function(data){
		//console.log(player.keys);
		//console.log("data = "data);
		if((d = data-100) >0)
		{
			player.keys[hx.constants.Directions[d]] = true;			
		}
		else
		{
			player.keys[hx.constants.Directions[data]] = false;			
		}
	});
});

var sendTxt = function()
{
	msg_p=document.createElement("p");
	txt = 	document.getElementById("text");
	msg = document.createTextNode(txt.value);
	//txt.value = "";
	msg_p.appendChild(msg);
	document.getElementById("peer").appendChild(msg_p);
}