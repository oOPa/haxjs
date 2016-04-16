var Loader = function(){
	var that = this;
    that.players =  [];
	that.logger = new Loader.Logger();
	that.physics = new Loader.Physics();
        Loader.prototype.render = function () {   
            for(i in that.players)
            {
                item = that.players[i];
                item.update();
            }

			that.physics.update();
        }
	};
Loader.Host =  {};
Loader.Client = {};
Loader.prototype.createRenderer = function()
{
	return (this.renderer = new Loader.Renderer(this.render));
};
Loader.prototype.createPlayer = function(name, avatar){
	var that = this;
    var player = new Loader.Host.Player(name,avatar,that.physics.world);
	that.players.push(player);
	if(typeof this.renderer != 'undefined')
	{
		that.renderer.addPlayer(player);
	}
	that.addText("* "+player.name+" was moved to red");
    return player;
};
Loader.prototype.buildBall = function()
{
    var that = this;
    var ball = new Loader.Physics.DefaultBall(that.physics.world);
    that.renderer.addBall(ball);
}
Loader.prototype.addText = function(txt) {
	this.logger.addChat(txt);
};

