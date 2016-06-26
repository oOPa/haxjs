class ClientRenderer {
    constructor()
{
	this.prototype = new Renderer();
	this.prototype.renderPlayers = this.renderPlayers;	
}
addPlayer (player){
       var that = this;
       var p = new RendererNetPlayer(player.name);
       that.prototype.camera.addChild(p.graphics);
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
class RendererNetPlayer  {
    constructor(name,avatar){
     var that = this;
		this.graphics = new PIXI.Graphics();
        that.graphics.position = new PIXI.Vector(0,0);
		that.graphics.lineStyle(3,0xFFFFFF);
		that.graphics.beginFill(0xE56E56, 1);
		//that.graphics.drawCircle(hx.constants.Player.RADIUS, 50,hx.constants.Player.RADIUS * hx.constants.World.SCALE);
        that.graphics.drawCircle(0,0,30 * hx.constants.Player.RADIUS )//* hx.constants.World.SCALE);
		that.name_label = new PIXI.Text(name,{font : '25px Arial', fill : 'white', align : 'center'});
		that.name_label.y = 30 * hx.constants.Player.RADIUS;
		that.graphics.endFill();
		that.graphics.addChild(that.name_label);

}
}