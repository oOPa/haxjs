/** sending and recieving data */
Net.prototype.sendToClients = function (data) {
	var keys = Object.keys(this.peer.connections);
	for(i in keys)
	{
		var item = this.peer.connections[keys[i]][0];
		item.send(data);
	}
}
Net.prototype.receiveClientData = function(client,data)
{
	var peer = client.peer;
	this[this.methods[data.command]].call(this,peer,data);
}
Net.prototype.sendChatMessage = function(message)
{

}
Net.prototype.sendToHost = function (data)
{
	var time = new Date().getTime();
	//this.queue.enque(this.me.keys);
	this.connection.send({time: time,command: hx.network.MOVE,val : this.me.keys});
	//this.connection.send({time: time,command: hx.network.INPUTS,val : this.getInputBuffer()});
}

Net.prototype.receiveHostData = function (data)
{
	var peer = data.peer || this.host;
	//console.log(data);
	this[this.methods[data.command]].call(this,peer,data);
};
Net.prototype.getPlayerFromId = function (peer) {
	return this.clients.get(peer);
}
Net.prototype.addChatMessage = function (peer,data)
{
	//console.log(this.getPlayerFromId(peer).name +" ("+peer+"): "+data.val);
};
Net.prototype.setKeys = function (peer,keys)
{
	//console.log("got input");
	var player = this.getPlayerFromId(peer);
	player.update
	player.keys = keys.val;
}
Net.prototype.getAuthoritativePosition = function (peer) {
	return this.getPlayerFromId(peer).getTotalPos();
	//this.peer.connections[this.client0][0].send({command: hx.network.AUTHORITY,val:pos,peer : this.client0});
}
Net.prototype.sendAllPos = function () {
	var positions = (this.getAllPos());
	for(i in positions)
	{
		this.sendToClients(positions[i]);
	}
}
Net.prototype.getAllPos = function () {
	var data = {}
	data.val = this.me.getTotalPos();
	data.command = hx.network.AUTHORITY;
	
	var total = [data];
	var keys = this.clients.keys();
	for(i in keys)
	{
		var peer = keys[i];
		total.push(this.createAuthorityPacket(peer));
	}
	return total;
}
Net.prototype.createAuthorityPacket = function(peer)
{
	var data = {}
	data.val = (this.getAuthoritativePosition(peer));
	data.command = hx.network.AUTHORITY;
	data.peer = peer;
	//data.vector = {};
	//vec = this.getPlayerFromId(peer).getVector();
	//data.vector.x = vec.x;
	//data.vector.y = vec.y;
	return data;
}
Net.prototype.receiveAuthoritativePosition = function(peer,data)
{
	var player = (peer == this.myPeer) ? this.me : this.getPlayerFromId(peer);
	//console.log(data.val);
	//this.syncPositionConverge(player,data);
}
Net.prototype.syncPosition = function(player,data)
{
	player.setPos({x : data.val.x,y:data.val.y});
}
Net.prototype.syncPositionConverge = function(time, keys, state)
{
   // PIXI.Vector
	var difference = state.position - (current.position);

    var distance = difference.length();

    if ( distance > 2.0 ){
		//completely out of sync
        //current.position = state.position;
		this.syncPosition();
	}
    else if ( distance > 0.1 )
     {   current.position += difference * 0.1;
	 }
	 //re-apply inputs
    //current.velocity = velocity;
	this.player.keys = keys;
}
Net.prototype.rewind = function(index)
{

}
Net.prototype.receiveInputs = function (peer,data) {
	console.log("received inputs "+data.val[1]);
}