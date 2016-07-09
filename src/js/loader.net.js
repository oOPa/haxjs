var Net = function(host,nickname)
{
	this.max = 8;
	this.nickname = nickname;
	this.isHost = host == null ? false : host;
	this.clients = new Hashtable();
	this.states = new Hashtable();
	this.queue = new Queue();

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
			this.timer = setInterval(this.sendAllPos.bind(this),hx.intervals);
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
		that.connection = this.connect(host,{metadata:that.nickname});
			
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
	if(this.isHost)
	{
			this.me = this.renderer.createPlayer("host","fakeevatar");
				this.renderer.startRender();

		make_room("room_name",this.peer.id)
		
	}
	
else{
				this.me = this.renderer.createPlayer(this.nickname,"fakeevatar");
								this.renderer.startRender();

	new ControllerClient(this.me,this);
	//create host player
	this.host = peer;
	var p = this.renderer.createPlayer("host");
	this.clients.put(peer,p);
}
new Controller(this.me)
	this.startUpdates();
}

