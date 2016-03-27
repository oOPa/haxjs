Loader.Net = function()
{
	this.isHost = false;
	//var peer;
}
Loader.Net.prototype.getRooms = function()
{
	return this.roomlist;
}
Loader.Net.prototype.enterRoom = function(peer_id,callback)
{
	var that = this;
	this.host = peer_id;
	this.peer = new Peer({host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	
	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		that.connection = peer.connect(that.host);
		
		that.connection.on('open', function(){
			console.log("connected to host!");
			//if typeof(callback) === "function") {
			callback.sucess();
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
Loader.Net.createRoom = function(callbacks)
{
	/*
	*on_peer_connect
	*on_peer_dc
	*on_peer_data
	*/
	var that = this;
	this.isHost = true;
	this.peer = new Peer('host',{host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	
	peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		console.log('waiting for connections');

		that.peer.on('connection', function(dataConnection) { 
			console.log("new peer "+dataConnection.peer+" connected");
			callback.on_peer_connect(dataConnection.peer);
			dataConnection.on('close',function(){
				callbacks.on_peer_dc(dataConnection);
			});
			
			dataConnection.on('data',function(data){
				callbacks.on_peer_data(data);
			});
		});

	}); 
	return this;
};

