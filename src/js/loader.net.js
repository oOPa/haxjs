var Net = function(host)
{
	this.max = 8;
	this.isHost = host == null ? false : host;
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
		this.timer = this.isHost ? setInterval(this.updateAllClients.bind(this),hx.intervals) : setInterval(this.sendToHost.bind(this),hx.intervals);
	}
}

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
			that.receiveHostData.call(that,dataConnection);
		});
		that.connection.on('error',function(err){
			console.log("unable to create room");
			console.log(err)
		});
		
		that.connection.on('close',function(){
				that.stopUpdates();
				console.log("lost connection to host");
			});
	}); 
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
			console.log(dataConnection.peer);
			var p=that.renderer.createPlayer(dataConnection.metadata,dataConnection.metadata);
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

Net.prototype.load = function () {
	placeCanvas();
	this.renderer = new Renderer();
	addChatRoom()
	if(this.isHost)
	{
		make_room("room_name",this.peer.id)
	}
	this.renderer.startRender();
	this.me = this.renderer.createPlayer("hostname","fakenick");
	new Controller(this.me);
	this.startUpdates();
}

/** sending and recieving data */
Net.prototype.receiveClientData = function(client,data)
{

	//var lag = (new Date().getTime()-data.time);
	//var pos = data.pos;
	var player = this.clients.get(client.peer);
	player.keys = data.val;
	player.update();
	client.send({time : data.time,pos:player.getTotalPos()});

}

Net.prototype.updatePlayerMovement = function (player,movement)
{
	//console.log(player.getName());
	//player.setTotalPos(movement);
}
Net.prototype.updateAllClients = function(client,data)
{
	//console.log("got data from " + this.clients.get(client.peer).getName());
	//console.log(data);
}

Net.prototype.sendToHost = function (data)
{
	//this.connection.send({time:new Date().getTime(),pos:this.me.getTotalPos()});
	this.connection.send({time: new Date().getTime(),command: hx.network.MOVE,val : this.me.keys});
	//this.connection.send(this.me.getTotalPos());
	//console.log(this.me.getTotalPos());
	
}
Net.prototype.receiveHostData = function (data)
{
	console.log("start comparing");
	console.log(data.pos);
	console.log(this.me.getTotalPos());
	console.log("end comparing");
};