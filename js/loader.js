var Loader = function(){
	var that = this;
    
    /** load renderer and physics engine */
    that.players =  [];
	that.physics = new Physics();
    //that.controller = new Controller();
    that.renderer = new Renderer();
    
    /** create player 1 */
    window.vagrant = that.createPlayer("vagrant",2);
    //that.camera.addChild(player.graphics);
      this.renderer.addPlayer(vagrant);
    //that.controller = new Controller(vagrant);
}
Loader.prototype.createPlayer = function(name, avatar){
	var that = this;
    var player = new that.Player(name,avatar,that.physics.world);
	that.players.push(player);
    return player;
}
Loader.prototype.addText = function(txt) {
	this.txt.text+= txt+"\n";
}
Loader.constants = {
	RADIUS : 25
};
