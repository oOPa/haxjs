
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
PlayerStore.prototype.setAvatar = function(peer_id)
{
    this.clients.get(peer_id).setAvatar
}
PlayerStore.prototype.createPlayer = function(player,key)
{
    this.clients.put(key,player);
}
/**
 * Net needs player
 * velocity
 * direction
 * avatar
 * 
 * Renderer needs player
 * RendererPlyer
 */
PlayerStore.prototype.RemovePlayer = function()
{
    
}
PlayerStore.prototype.getPlayers = function()
{
    return this.clients.keys();
}
var PlayerIterator = function()
{
    
}
PlayerStore.prototype.createPlayer = function(name,avatar)
{
        var player = new NetPlayer(name,avatar);
        this.players.push(player);
        this.renderer.addPlayer(player);
        return player;
}
PlayerStore.prototype.buildBall =function ()
{
        var ball = new DefaultBall(this.physics.world);
        this.renderer.addBall(ball);
}
