
var Vec = function (deg, mag) {
    var deg = deg2rad(deg);
    this.vec = new PIXI.Vector(Math.cos(deg) * mag, Math.sin(deg) * mag);
    }

var deg2rad = function (deg) {
        return deg * Math.PI / 180;
}
var Pack = function(velocity,position)
{
    this.velocity = velocity;
    this.position = position;
}
var PlayerStore = function ()
{
    this.clients = new Hashtable();
}
PlayerStore.prototype.addPlayer = function(player,key)
{
    this.clients.put(key,player);
}
PlayerStore.prototype.RemovePlayer = function()
{
    
}
PlayerStore.prototype.getPlayers = function()
{
    
}
var PlayerIterator = function()
{
    
}