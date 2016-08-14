var Host = function(nickname)
{
	this.max = 8;
	this.nickname = nickname;
	this.clients = new Hashtable();
	this.updating = false;
	this.stadium = new Stadium(SampleStadium);
	this.methods = [];
	this.playerIndex = 0;
	this.defineNetworkCommands();
}

Host.prototype.defineNetworkCommands = function()
{
	this.methods[hx.network.PLAYERS] = "sendPlayers";
	this.methods[hx.network.MOVE] = "setKeys";
}

Host.prototype.stopUpdates =function ()
{
	if(typeof this.timer != 'undefined')
	{
		clearInterval(this.timer);
		this.updating = false;
	}
}


Host.prototype.startUpdates = function ()
{
	if(this.updating == false)
	{
		this.timer = setInterval(this.sendStateSync.bind(this),hx.intervals);			
		this.updating = true;
	}
}
Host.prototype.getPlayerFromId = function (peer) {
	return this.clients.get(peer);
}

Host.prototype.getNewPlayerIndex = function()
{
	return ++this.playerIndex;
}
Host.prototype.createRoom = function()
{
	var that = this;
	this.peer = new Peer({host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	
	this.peer.on('open', function(id)
	{
		console.log('My peer ID is: ' + id);
		console.log('waiting for connections');
		that.load();
		that.peer.on('connection', function(dataConnection)
		{ 
			console.log("new peer "+dataConnection.peer+" connected");
			window.datacon = dataConnection;
			var p=that.renderer.createPlayer(dataConnection.metadata,dataConnection.metadata,that.getNewPlayerIndex());
			that.clients.put(dataConnection.peer,p);
			dataConnection.on('close',function(){
				that.clients.remove(dataConnection.peer);
				console.log(dataConnection.peer +" has left");
			});
			
			dataConnection.on('data',function(data){
				that.receiveClientData(dataConnection,data);
			});
		});

	}); 
	this.peer.on('error',function(err){
		console.log("error?");
		console.log(err);
	});
	
};

Host.prototype.load = function (peer) 
{
	var that = this;
	placeCanvas();
	this.renderer = new Renderer();
	this.renderer.init();
	addChatRoom();
	$("#chat-send").on('click',function(){
			that.sendChatMessage.call(that,getMessage());
	});

	this.me = this.renderer.createPlayer(this.nickname,"fakeevatar",0);
	this.renderer.startRender();
	make_room("room_name",this.peer.id);
	new Controller(this.me)
	this.startUpdates();
}

/** sending and recieving data */
Host.prototype.sendToClients = function (data) {
	var keys = Object.keys(this.peer.connections);
	for(i in keys)
	{
		var item = this.peer.connections[keys[i]][0];
		item.send(data);
	}
}
Host.prototype.receiveClientData = function(client,data)
{
	var peer = client.peer;
	this[this.methods[data.command]].call(this,peer,data,client);
}
Host.prototype.setKeys = function (peer,keys)
{
	var player = this.getPlayerFromId(peer);
	player.keys = keys.val;
}
Host.prototype.sendStateSync = function()
{
	var data = {command: hx.network.STATE, val: this.renderer.getStateSync()}
	this.sendToClients(data);
}
Host.prototype.sendPlayers = function(peer,data,datacon)
{
	datacon.send({command: hx.network.PLAYERS, val: this.getPlayers(),localPlayerIndex : this.getPlayerFromId(peer).index})
}
Host.prototype.getPlayers = function()
{
	var players = [];
	//add host
	players.push({id : this.me.index,name:this.me.name,avatar : this.me.avatar});
	//add other players
	var keys = this.clients.keys();
	for(i in keys)
	{
		item = this.getPlayerFromId(keys[i]);
		players.push({id : item.index,name:item.name,avatar : item.avatar});
	}	
	return players;
}
Host.prototype.sendStadiumHash = function(peer,data,datacon)
{
	datacon.send({command: hx.network.STADIUM_HASH, hash : this.stadium.getHashCode()})
}
Host.prototype.sendStadium = function(peer,data,datacon)
{
	datacon.send({command: hx.network.STADIUM_HASH, val : StadiumStore[data.hash]})
}