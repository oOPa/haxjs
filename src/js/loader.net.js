class Net
{
	constructor()
	{
	this.max = 8;
	this.isHost = false;
	this.clients = new Hashtable();
	}

getRooms ()
{
	return this.roomlist;
};
stopUpdates ()
{
	if(typeof this.timer != 'undefined')
	{
		clearInterval(this.timer);
	}
};
startUpdates ()
{
	if(typeof this.timer == 'undefined')
	{
		this.timer = this.isHost ? setInterval(this.updateClients,hx.intervals) : setInterval(this.sendUpdatesToHost,hx.intervals);
	}
};
updateClients ()
{
	n = ['host']
	n.push(haxball.players[0].point())
	if(haxball.first && haxball.first.open)
	{
		haxball.first.send(n);
	}

	keys = haxball.net.clients.keys();
	for(i in keys)
	{
		item = keys[i]
		n = [item]
		n.push(haxball.net.clients.get(item).point());
		
		for (x in haxball.net.peer.connections){
			//host	
			con = haxball.net.peer.connections[x][0];
			con.send(n);
		}
	}
	
	//console.log(n);
};
sendUpdatesToHost ()
{
	window.host.send(haxball.controller.keys);
};
updateFromHost (updates)
{
	//console.log("sending updates");
	//data = {name : 'host'}	
	haxball.renderer.prototype.players.get(updates[0]).point = updates[1];
};
joinRoom (peer_id,callbacks)
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
		that.connection = this.connect(that.host,{metadata:haxball.ui.nick});
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
		that.connection.on('error',function(err){
			console.log(err)
		})
	}); 
	return this;
};
receiveClientData (con,data)
{
	this.clients.get(con.peer).keys = data;
};
sendMessage ()
{
	if(this.isHost)
	{
		
	}
	else
	{
		
	}
};
createRoom (callbacks)
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
	this.peer = new Peer({host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	
	this.peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		console.log('waiting for connections');
		callbacks.on_peer_init();
		that.peer.on('connection', function(dataConnection) { 
			console.log("new peer "+dataConnection.peer+" connected");
			callbacks.on_peer_connect(dataConnection.peer,dataConnection.metadata);
			haxball.first = dataConnection;
			dataConnection.on('close',function(){
				haxball.net.clients.remove(dataConnection.peer);
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
}