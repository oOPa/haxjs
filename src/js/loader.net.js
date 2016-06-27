var Net = function()
{
	this.max = 8;
	this.isHost = false;
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
Net.prototype.joinRoom = function(peer_id,resolve,reject)
{
	var that = this;
	this.host = peer_id;
	this.peer = new Peer({host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	this.peer.on('open', function(id) 
	{
		console.log('My peer ID is: ' + id);
		that.connection = this.connect(that.host,{metadata:haxball.ui.nick});
		
		that.connection.on('open', function(){
			console.log("connected to host!");
			window.host = that.connection;
			resolve();
		});
		
		that.connection.on('data',function(dataConnection){
			that.updateFromHost(dataConnection);
		});
		that.connection.on('error',function(err){
			reject(err);
		});
	}); 
}

Net.prototype.receiveClientData = function(con,data)
{
	return;
	if(data[0] == hx.network.pack)
	{
		console.log(data);	
	}
	//this.clients.get(con.peer).keys = data;
};
Net.prototype.sendMessage = function ()
{
	if(this.isHost)
	{
		
	}
	else
	{
		
	}
};
Net.prototype.createRoom = function()
{

	var that = this;
	this.isHost = true;
	this.peer = new Peer({host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	
	this.peer.on('open', function(id)
	{
		
		console.log('My peer ID is: ' + id);
		console.log('waiting for connections');
		callbacks.on_peer_init.apply();
		that.peer.on('connection', function(dataConnection)
		{ 
			console.log("new peer "+dataConnection.peer+" connected");
			callbacks.on_peer_connect(dataConnection.peer,dataConnection.metadata);
			
			dataConnection.on('close',function(){
				that.clients.remove(dataConnection.peer);
				callbacks.on_peer_dc(dataConnection);
			});
			
			dataConnection.on('data',function(data){
				//callbacks.on_peer_data(data);
				that.receiveClientData(dataConnection,data);
			});
		});

	}); 
	this.peer.on('error',function(err){
		callbacks.on_error(err);
	});
	
};

Net.prototype.updateClients = function()
{
	var that = this;
	var n = ['host']
	n.push(haxball.players[0].point())
	if(haxball.first && haxball.first.open)
	{
		haxball.first.send(n);
	}

	//var keys = that.clients.keys();
	console.log(this);
	//return;
	for(i in keys)
	{
		var item = keys[i]
		var n = [item]
		n.push(that.clients.get(item).point());
		
		for (var x in that.peer.connections){
			//host	
			var con = that.peer.connections[x][0];
			con.send(n);
		}
	}
	
	//console.log(n);
};
