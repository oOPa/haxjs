//NetRenderer.prototype.constructor=NetRenderer;
Loader.Client.Renderer = function()
{
	this.prototype = new Loader.Renderer();
	this.prototype.renderPlayers = this.renderPlayers;	
	
};
Loader.Client.Renderer.prototype.addPlayer = function(peer_id,name){
       var that = this;
       p = new Loader.Client.Renderer.RendererNetPlayer(name);
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
Loader.Client.Renderer.RendererNetPlayer = function (name) {
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
		
		this.point = {x:0,y:0};
				that.graphics.addChild(that.name_label);

};
