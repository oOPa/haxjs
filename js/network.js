Loader.Net = function()
{
	this.isHost = false;
	//var peer;
}
Loader.Net.prototype.getRooms = function()
{
	return this.roomlist;
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
			//if typeof(callback) === "function") {
			callbacks.on_host_connect();
		});
		
		that.connection.on('data',function(dataConnection){
			/** on receive data from host **/
		});
	}); 
	return this;
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
			dataConnection.on('close',function(){
				callbacks.on_peer_dc(dataConnection);
			});
			
			dataConnection.on('data',function(data){
				callbacks.on_peer_data(data);
			});
		});

	}); 
	this.peer.on('error',function(err){
		callbacks.on_error(err);
	});
	
};

