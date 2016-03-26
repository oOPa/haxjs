var Loader = function(){
	var that = this;
    that.players =  [];
	that.physics = new Physics();
        Loader.prototype.render = function () {   
            /** update player movement */
            for(i in that.players)
            {
                item = that.players[i];
                item.update();
            }
              // p = that.players[1].point();
    //console.log(p);
			that.physics.update();
        }
		if(typeof Renderer != 'undefined'){
this.renderer = new Renderer(this.render)}
        /** default controller and player */
        window.vagrant = that.createPlayer("vagrant",20);
        window.controller = new Controller(window.vagrant);
		window.onyema = that.createPlayer("onyema",4);
        /**  */
if(typeof Renderer != 'undefined'){
    this.renderer.startRender();}
}
Loader.prototype.createPlayer = function(name, avatar){
	var that = this;
    var player = new that.Player(name,avatar,that.physics.world);
	that.players.push(player);
	if(typeof this.renderer != 'undefined')
	{
		that.renderer.addPlayer(player);
	}
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
	RADIUS : 25
};
