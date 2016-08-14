var Client = function(nickname)
{
	this.nickname = nickname;
    this.playbackQueue = new PlaybackQueue();
	this.lastSnapshotSeq = 0;
	this.updating = false;
	this.loader = new GameLoaderState(this.displayRoom,this);
	this.playerIndex = 0;
	this.methods = [];
	this.defineNetworkCommands();
}

/** initialisation code */
Client.prototype.defineNetworkCommands = function()
{
	this.methods[hx.network.PLAYERS] = "receivePlayers";
	this.methods[hx.network.STATE] = "receiveSynchronization";
}
Client.prototype.stopUpdates =function ()
{
	if(typeof this.timer != 'undefined')
	{
		clearInterval(this.timer);
		this.updating = false;
	}
}

Client.prototype.startUpdates = function ()
{
	if(this.updating == false)
	{
		//buffer server updates and then send them to the renderer
		this.timer = setInterval(this.play.bind(this),hx.playbackBufferTime);
		this.updating = true;
	}
}


Client.prototype.joinRoom = function(host)
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
			that.loadRoom(host);	
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



Client.prototype.sendInputToHost = function (data)
{
	this.connection.send({time: getTimeMs(),command: hx.network.MOVE,val : this.me.keys});
}

Client.prototype.receiveHostData = function (data)
{
	//console.log(data);
	var peer = data.peer || this.host;
	this[this.methods[data.command]].call(this,peer,data);
};

/** requests from server */
Client.prototype.requestStadiumHash = function()
{
	this.connection.send({time: getTimeMs(),command: hx.network.STADIUM_HASH});
}
Client.prototype.requestStadium = function(hash)
{
	this.connection.send({time: getTimeMs(),command: hx.network.STADIUM,hash : hash});
}
Client.prototype.requestPlayers = function()
{
	this.connection.send({time: getTimeMs(),command: hx.network.PLAYERS});
}

/** bootstrapping */
Client.prototype.loadRoom = function (peer) 
{
	var that = this;
	placeCanvas();
	this.renderer = new Prediction();
	this.renderer.init();
	addChatRoom();

	//load stadium and players from network
	this.requestPlayers();

	//load chat room 
	$("#chat-send").on('click',function(){
		that.sendChatMessage.call(that,getMessage());
	});

}
Client.prototype.play = function()
{
	this.copyBuffer();
}
Client.prototype.copyBuffer = function()
{
	while(this.playbackQueue.hasNext())
	{
		this.renderer.playbackQueue.add(this.playbackQueue.getNext());
	}
}

/** server responses */
Client.prototype.receivePlayers = function(peer,data)
{
	this.renderer.setLocalPlayerIndex(data.localPlayerIndex);
	for(var i in data.val)
	{
		var player = data.val[i];

		var p = this.renderer.createPlayer(player.name,player.avatar,player.id);
				console.log(data);
		if(i == data.localPlayerIndex)
		{
			this.me = p;
			new ControllerClient(this.me,this);
		}
	}
	//load game
	this.displayRoom();
}

Client.prototype.receiveStadiumHash = function(peer,data)
{
	var hash = data.hash;
	var stadium = getStadiumFromHash(hash);
	if(stadium)
	{
		this.setStadium(stadium);
		this.loader.stadiumReady();
	}
	else
	{
		this.requestStadium(hash);	
	}
}
Client.prototype.receiveStadium = function()
{
	var stadium = data.val;
	addStadium(stadium)
	this.loader.stadiumReady();
}

Client.prototype.receiveSynchronization = function(peer,data)
{
	if(data.val[0] > this.lastSnapshotSeq)
	{
		this.lastSnapshotSeq = data.val[0];
		this.playbackQueue.add(data.val);
	}
}

/** running the game */
Client.prototype.setStadium = function(stadium)
{
	this.renderer.setStadium(stadium);
}

Client.prototype.displayRoom = function()
{
	console.log("room ready");
	this.startUpdates();
	this.renderer.startRender();
}
