var Net = function(host)
{
	this.max = 8;
	this.isHost = host == null ? false : host;
	this.clients = new Hashtable();
	this.states = new Hashtable();
	//corresponds with hx.network
	this.methods = ["","","","setKeys","","addChatMessage","receiveAuthoritativePosition"];
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
		if(this.isHost)
		{
			this.timer = setInterval(this.sendAuthoritativePosition.bind(this),hx.intervals);
		}
		//this.timer = this.isHost ? setInterval(this.updateAllClients.bind(this),hx.intervals) : setInterval(this.sendToHost.bind(this),hx.intervals);
	}
}

Net.prototype.joinRoom = function(host)
{
	var that = this;
	placeCanvas();
	this.peer = new Peer({host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	this.peer.on('open', function(id) 
	{
		that.myPeer = id;
		console.log('My peer ID is: ' + id);
		that.connection = this.connect(host,{metadata:'haxball.ui.nick'});
			
		that.connection.on('open', function(){
			console.log("connected to host!");
			that.load(host);	
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
			that.client0 = dataConnection.peer;
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

Net.prototype.load = function (peer) 
{
	var that = this;
	placeCanvas();
	this.renderer = this.isHost ? new Renderer() : new Prediction();
	addChatRoom();
	$("#chat-send").on('click',function(){
			that.sendChatMessage.call(that,getMessage());
	});
	this.me = this.renderer.createPlayer("hostname","fakenick");
	this.renderer.startRender();
	if(this.isHost)
	{
		make_room("room_name",this.peer.id)
	}
	
else{
	new ControllerClient(this.me,this);
	//create host player
	this.host = peer;
	var p = this.renderer.createPlayer(this.connection.metadata);
	this.clients.put(peer,p);
}
new Controller(this.me)
	this.startUpdates();
}

/** sending and recieving data */
Net.prototype.receiveClientData = function(client,data)
{
	//var player = this.clients.get(client.peer);
	//player.keys = data.val;
	var peer = client.peer;
	this[this.methods[data.command]].call(this,peer,data);
	//client.send({time : data.time,command: hx.network.MOVE,val:player.point()});
}
Net.prototype.sendChatMessage = function(message)
{
	if(this.isHost)
	{
		//send to everyone
		this.peer.connections[this.client0][0].send({command: hx.network.CHAT,val:message});
	}
	else
	{
		this.connection.send({command: hx.network.CHAT,val:message});
	}
}
Net.prototype.sendToHost = function (data)
{
	var time = new Date().getTime();
	this.connection.send({time: time,command: hx.network.MOVE,val : this.me.keys});
}
Net.prototype.receiveHostData = function (data)
{
	var peer = data.peer || this.host;
	this[this.methods[data.command]].call(this,peer,data);
};
Net.prototype.getPlayerFromId = function (peer) {
	return this.clients.get(peer);
}
Net.prototype.addChatMessage = function (peer,data)
{
	console.log(this.getPlayerFromId(peer).name +" ("+peer+"): "+data.val);
};
Net.prototype.setKeys = function (peer,keys)
{
	//console.log(keys.val);
	var player = this.getPlayerFromId(peer);
	player.keys = keys.val;
	//console.log(player.keys);
}
Net.prototype.sendAuthoritativePosition = function () {
	var pos = this.getPlayerFromId(this.client0).getTotalPos();
	this.peer.connections[this.client0][0].send({command: hx.network.AUTHORITY,val:pos,peer : this.client0});
}
Net.prototype.receiveAuthoritativePosition = function(peer,data)
{
	if(data.val.vxvy != 0)
	{
	var dt = new Date().getTime() - data.val.time;
	var x = dt * data.val.vx
	var y = dt * data.val.vy
	var point = (peer == this.myPeer) ? this.me.point() : this.getPlayerFromId(peer).point();
	
	console.log("server predicted: "+x+"\t"+y);
	console.log("client position : "+point.x+"\t"+point.y);
	}
	else
	{
		var player = (peer == this.myPeer) ? this.me : this.getPlayerFromId(peer);
		var point = player.point();
		console.log("server static: "+data.val.x+"\t"+data.val.y);
		console.log("client static: "+point.x+"\t"+point.y);
		/** perfome correction */
		player.setPos({x : data.val.x,y:data.val.y});
	}
}