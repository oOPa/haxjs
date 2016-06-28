var Net = function(host)
{
	this.max = 8;
	this.isHost = host;
	this.clients = new Hashtable();
}

Net.prototype.getRooms = function ()
{
	return this.roomlist;
}
Net.prototype.stopUpdates =function ()
{
	if(typeof this.timer != 'undefined')
	{
		clearInterval(this.timer);
	}
}
Net.prototype.startUpdates = function ()
{
	if(typeof this.timer == 'undefined')
	{
		this.timer = this.isHost ? setInterval(this.updateClients,hx.intervals) : setInterval(this.sendUpdatesToHost,hx.intervals);
	}
}
Net.prototype.sendUpdatesToHost = function ()
{
	return;
}
Net.prototype.updateFromHost = function (updates)
{
	//haxball.renderer.prototype.players.get(updates[0]).point = updates[1];
};
Net.prototype.joinRoom = function(host)
{
	var that = this;
	placeCanvas();
	this.peer = new Peer({host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	this.peer.on('open', function(id) 
	{
		console.log('My peer ID is: ' + id);
		that.connection = this.connect(host,{metadata:'haxball.ui.nick'});
			
		that.connection.on('open', function(){
			console.log("connected to host!");
			that.load();	
		});
		
		that.connection.on('data',function(dataConnection){
			that.updateFromHost(dataConnection);
		});
		that.connection.on('error',function(err){
			console.log("unable to create room");
			console.log(err)
		});
	}); 
}


Net.prototype.createRoom = function()
{
	
}
Net.prototype.createRoom = function()
{

	var that = this;
	this.isHost = true;
	this.peer = new Peer({host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	
	this.peer.on('open', function(id)
	{
		console.log('My peer ID is: ' + id);
		console.log('waiting for connections');
		that.load();
		that.peer.on('connection', function(dataConnection)
		{ 
			console.log("new peer "+dataConnection.peer+" connected");
			var p=that.render.createPlayer(dataConnection.metadata,dataConnection.metadata);
			that.clients.p.put(dataConnection.peer,p);
			
			dataConnection.on('close',function(){
				that.clients.remove(dataConnection.peer);
				console.log(dataConnection.peer +" has left");
			});
			
			dataConnection.on('data',function(data){
				//callbacks.on_peer_data(data);
				that.receiveClientData(dataConnection,data);
			});
		});

	}); 
	this.peer.on('error',function(err){
		console.log("error?");
		console.log(err);
	});
	
};

Net.prototype.load = function () {
	if(this.isHost)
	{
		make_room("room_name",this.peer.id)
		//console.log("roon_name",this.peer.id);
	}
	placeCanvas();
	this.renderer = new Renderer();
	addChatRoom();
	this.renderer.startRender();
	this.host = this.renderer.createPlayer("hostname","fakenick");
	new Controller(this.host);
	this.startUpdates.apply();
}
