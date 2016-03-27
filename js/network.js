window.updateintervalinmilliescs = 500;
Loader.Net = function()
{
	this.isHost = false;
	this.clients = new Hashtable();
}
Loader.Net.prototype.getRooms = function()
{
	return this.roomlist;
}
Loader.Net.prototype.stopUpdates = function ()
{
	if(typeof this.timer != 'undefined')
	{
		clearInterval(this.timer)
	}
}
Loader.Net.prototype.startUpdates = function ()
{
	if(typeof this.timer == 'undefined')
	{
		this.timer = this.isHost ? setInterval(this.updateClients,updateintervalinmilliescs) : setInterval(this.sendUpdatesToHost,updateintervalinmilliescs);
	}
}
Loader.Net.prototype.updateClients = function ()
{
	//console.log("sending updates");
	//data = {name : 'host'}
	updates = [];
	n = ['host']
	n.push(window.game.players[0].point())
	window.first.send(n);
	keys = net.clients.keys();
	for(i in keys)
	{
		item = keys[i]
		n = [item]
		n.push(net.clients.get(item).point());
		for (x in net.peer.connections){
			con = net.peer.connections[x][0];
			con.send(n);
		}
	}
	
	//console.log(n);
}
Loader.Net.prototype.sendUpdatesToHost = function ()
{
	window.host.send(window.controller.keys);
}
Loader.Net.prototype.updateFromHost = function (updates)
{
	//console.log("sending updates");
	//data = {name : 'host'}
	//console.log(updates);
	window.renderer.prototype.players.get(updates[0]).point = updates[1];
}
Loader.Net.prototype.joinRoom = function(peer_id,callback)
{
		/*
	*on_error
	*on_host_connect
	*on_host_dc
	*on_host_data
	*/
	var that = this;
	this.host = peer_id;
	this.peer = new Peer({host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	
	this.peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		that.connection = this.connect(that.host.host);
		that.connection.on('open', function(){
			console.log("connected to host!");
			window.host = that.connection;
			//if typeof(callback) === "function") {
			callbacks.on_host_connect();
		});
		
		that.connection.on('data',function(dataConnection){
			//callbacks.on_host_data(dataConnection);
			//console.log(dataConnection);
			that.updateFromHost(dataConnection);
		});
	}); 
	return this;
}
Loader.Net.prototype.receiveClientData = function(con,data)
{
	this.clients.get(con.peer).keys = data;
}
Loader.Net.prototype.sendMessage = function()
{
	if(this.isHost)
	{
		
	}
	else
	{
		
	}
}
Loader.Net.prototype.createRoom = function(callbacks)
{
	/*
	*on_peer_init
	*on_error
	*on_peer_connect
	*on_peer_dc
	*on_peer_data
	*/
	var that = this;
	this.isHost = true;
	this.peer = new Peer('host',{host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	
	this.peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		console.log('waiting for connections');
		callbacks.on_peer_init();
		that.peer.on('connection', function(dataConnection) { 
			console.log("new peer "+dataConnection.peer+" connected");
			callbacks.on_peer_connect(dataConnection.peer);
			window.first = dataConnection;
			dataConnection.on('close',function(){
				window.net.clients.remove(dataConnection.peer);
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

