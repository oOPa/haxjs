class ClientRenderer {
    constructor()
{
	this.prototype = new Renderer();
	this.prototype.renderPlayers = this.renderPlayers;	
}
addPlayer (player){
       var that = this;
       var p = new RendererPlayer(player);
       this.prototype.camera.addChild(p.graphics);
       this.prototype.players.put(player.peer,player);
       this.player.render = p;	   
      };
       
renderPlayers(){
    var that = this;
    let keys = that.players.keys();
    for(i in keys)
    {
        let item = that.players.get(keys[i]);
        let point = item.point;
        var render_graphics = item.render.graphics;
        render_graphics.position.x = point.x;
        render_graphics.position.y = point.y;

    }
};
}
