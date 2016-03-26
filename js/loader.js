var Loader = function(){
	var that = this;
    
    /** load renderer and physics engine */
    that.players =  [];
	that.physics = new Physics();
    
    /** create player 1 */
    window.vagrant = that.createPlayer("vagrant",2);
    this.controller = window.controller = new Controller(vagrant);
    
     window.renderer = this.renderer = new Renderer(this.physics,window.controller);
      this.renderer.addPlayer(vagrant,controller);
      
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
}
Loader.constants = {
	RADIUS : 25
};
