var Loader = function(){
	var that = this;
    that.players =  [];
	that.physics = new Physics();
        Loader.prototype.render = function () {   
            for(i in that.players)
            {
                item = that.players[i];
                item.update();
            }

			that.physics.update();
        }
	}
Loader.prototype.createRenderer = function()
{
	if(typeof Renderer != 'undefined' ){
		this.renderer = new Renderer(this.render)
		return this.renderer;
	}
}
Loader.prototype.createPlayer = function(name, avatar){
	var that = this;
    var player = new Player(name,avatar,that.physics.world);
	that.players.push(player);
	if(typeof this.renderer != 'undefined')
	{
		that.renderer.addPlayer(player);
	}
	that.addText("* "+player.name+" was moved to red");
    return player;
}
Loader.prototype.addText = function(txt) {
    if(this.renderer){
        this.renderer.addText(txt)
    }
    else{
        return false;
    }
}

Loader.constants = {
	factor:50.0
}