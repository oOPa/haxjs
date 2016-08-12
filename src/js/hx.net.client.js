Net.prototype.reciveSynchronisation = function(peer,data)
{
	//this.monkey = (data.val);
	if(data.val[0] > this.lastSnapshotSeq)
	{
		this.lastSnapshotSeq = data.val[0];
		this.playbackQueue.add(data.val);
		//console.log(data.val);
	}
}
Net.prototype.receiveSnapshot = function(dummy,data)
{
	var that = this;
	if(data.val[0] > this.lastSnapshotSeq)
	{
		this.lastSnapshotSeq = data.val[0];
	
		this.playbackQueue.add(data.val);
		
	}
}

Net.prototype.sendToHost = function (data)
{
	this.connection.send({time: getTimeMs(),command: hx.network.MOVE,val : this.me.keys});
}

Net.prototype.receiveHostData = function (data)
{
	var peer = data.peer || this.host;
	this[this.methods[data.command]].call(this,peer,data);
};

Net.prototype.requestStadiumHash = function()
{
	this.connection.send({time: getTimeMs(),command: hx.network.STADIUM_HASH});
}
Net.prototype.requestStadium = function(hash)
{
	this.connection.send({time: getTimeMs(),command: hx.network.STADIUM_HASH,hash : hash});
}
Net.prototype.requestPlayers = function()
{
	this.connection.send({time: getTimeMs(),command: hx.network.PLAYERS,hash : hash});
}
Net.prototype.loadClientRoom = function (peer) 
{
	var that = this;
	placeCanvas();
	this.renderer = new Prediction();
	this.renderer.init();
	addChatRoom();

	//load stadium and players from network
	this.requestPlayers();
	this.requestStadiumHash();
	$("#chat-send").on('click',function(){
			that.sendChatMessage.call(that,getMessage());
	});

	//new ControllerClient(this.me,this);
	this.startUpdates();
}
Net.prototype.play = function()
{
	this.copyBuffer();

}
Net.prototype.copyBuffer = function()
{
	while(this.playbackQueue.hasNext())
	{
		this.renderer.playbackQueue.add(this.playbackQueue.getNext());
	}
}
Net.prototype.receivePlayers = function(peer,data)
{
	this.localPlayerIndex = data.localPlayerIndex;
	for(var i in data.val)
	{
		var player = data.val[i];
		net.renderer.createPlayer(player.name,player.avatar,player.index)
	}
	this.loader.playerIndexReady();
	this.loader.otherPlayersReady();
}
Net.prototype.receiveStadiumHash = function(peer,data)
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
Net.prototype.receiveStadium = function()
{
	var stadium = data.val;
	//var hash = data.hash;

	addStadium(stadium)
	this.loader.stadiumReady();
}
Net.prototype.setStadium = function(stadium)
{
	this.renderer.setStadium(stadium);
}

//after room has been loaded
Net.prototype.displayRoom = function()
{
	console.log("room ready");
}
