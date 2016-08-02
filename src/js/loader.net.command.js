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

Net.prototype.sendToHost = function (data)
{
	this.connection.send({time: getTimeMs(),command: hx.network.MOVE,val : this.me.keys});
}

Net.prototype.receiveHostData = function (data)
{
	var peer = data.peer || this.host;
	this[this.methods[data.command]].call(this,peer,data);
};

Net.prototype.setKeys = function (peer,keys)
{
	var player = this.getPlayerFromId(peer);
	player.keys = keys.val;
}

