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
			that.physics.update();
        }
        /** default controller and player */
        window.vagrant = that.createPlayer("vagrant",20);
        window.controller = new Controller(window.vagrant);
		window.onyema = that.createPlayer("onyema",4);
        /**  */
if(typeof Renderer != 'undefined'){
    this.renderer = new Renderer(this.render);
    this.renderer.addPlayer(window.vagrant);
    this.renderer.addPlayer(window.onyema);
    this.renderer.startRender();}
}
Loader.prototype.createPlayer = function(name, avatar){
	var that = this;
    var player = new that.Player(name,avatar,that.physics.world);
	that.players.push(player);
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
