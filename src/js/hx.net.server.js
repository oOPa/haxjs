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
	this[this.methods[data.command]].call(this,peer,data,client);
}
Net.prototype.setKeys = function (peer,keys)
{
	var player = this.getPlayerFromId(peer);
	player.keys = keys.val;
}
Net.prototype.sendSnapshot = function()
{
	var data = {command: hx.network.SNAPSHOT, val: this.renderer.getState()}
	//console.log(data)
	this.sendToClients(data);
}
Net.prototype.sendStateSync = function()
{
	var data = {command: hx.network.STATE, val: this.renderer.getStateSync()}
	this.sendToClients(data);
}
Net.prototype.sendPlayers = function(peer,data,datacon)
{
	datacon.send({command: hx.network.PLAYERS, val: this.getPlayers(),localPlayerIndex : getPlayerFromId(peer).index})
}
Net.prototype.getPlayers = function()
{
	var players = [];
	var keys = net.clients.keys();
	for(i in keys)
	{
		item = getPlayerFromId(keys[i]);
		players.push({id : item.index,name:item.name,avatar : item.avatar});
	}	
	return players;
}