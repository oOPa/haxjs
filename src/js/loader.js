var Haxball = function(){
	this.players = [];
	this.logger = new Logger();
	this.physics = new Physics();
	this.host = 1;
}
	
Haxball.prototype.createRenderer = function ()
{
	return this.host ? (this.renderer = new Renderer(this.physics)) : (this.renderer = new ClientRenderer(this.physics));
}
Haxball.prototype.createPlayer = function(name,avatar,peer_id)
{
	var player = new NetPlayer(name,avatar,this.physics.world,peer_id);
	this.players.push(player);
	this.renderer.addPlayer(player);
	this.addText("* "+player.name+" was moved to red");
	return player;
}
Haxball.prototype.buildBall =function ()
{
	var ball = new DefaultBall(this.physics.world);
	this.renderer.addBall(ball);
}
