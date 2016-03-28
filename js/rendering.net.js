//NetRenderer.prototype.constructor=NetRenderer;
Loader.Client.Renderer = function()
{
	this.prototype = new Loader.Renderer();
	this.prototype.renderPlayers = this.renderPlayers;	
	
}
Loader.Client.Renderer.prototype.addPlayer = function(peer_id){
       var that = this;
       p = new Loader.Client.Renderer.RendererNetPlayer();
       that.prototype.camera.addChild(p.graphics);
       this.prototype.players.put(peer_id, p);
	   
       
};
Loader.Client.Renderer.prototype.renderPlayers = function(){
    var that = this;
    keys = that.players.keys();
    for(i in keys)
    {
        item = that.players.get(keys[i]);
        point = item.point;
        
        item.graphics.position.x = point.x;
        item.graphics.position.y = point.y;

    }
};
Loader.Client.Renderer.RendererNetPlayer = function () {
     var that = this;
		this.graphics = new PIXI.Graphics();
		console.log(this.graphics)
        that.graphics.position = new PIXI.Vector(0,0);
		that.graphics.lineStyle(3,0xFFFFFF);
		that.graphics.beginFill(0xE56E56, 1);
		//that.graphics.drawCircle(hx.constants.Player.RADIUS, 50,hx.constants.Player.RADIUS * hx.constants.World.SCALE);
        that.graphics.drawCircle(0,0,30 * hx.constants.Player.RADIUS )//* hx.constants.World.SCALE);
		that.graphics.endFill();
		this.point = {x:0,y:0};
}
