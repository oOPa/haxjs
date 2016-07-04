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
	this.connection.send({time: time,command: hx.network.MOVE,val : this.me.keys});
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
	var player = this.getPlayerFromId(peer);
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
	return data;
}
Net.prototype.receiveAuthoritativePosition = function(peer,data)
{
	if(data.val.vxvy != 0)
	{
	var dt = new Date().getTime() - data.val.time;
	var x = dt * data.val.vx
	var y = dt * data.val.vy
	var point = (peer == this.myPeer) ? this.me.point() : this.getPlayerFromId(peer).point();
	
	//console.log("server predicted: "+x+"\t"+y);
	//console.log("client position : "+point.x+"\t"+point.y);
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
