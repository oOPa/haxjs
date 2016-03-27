var Renderer = function(renderFunction){
	var that = this;
    this.players = new Hashtable();
    this.init();
    this.renderFunction = renderFunction || new Function();
};
Renderer.prototype.init = function(){
var that = this;
//var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: false });
this.renderer = renderer;
document.getElementById("game-view").appendChild(renderer.view)
//renderer.backgroundColor = 0x718c5a;
renderer.backgroundColor = 0x939e7f;

// create the root of the scene graph
/**
	stage
		graphics
			viewport_
				camera
					players
			chat
				log
				txt
				
			misc
				menuTxt
				optTxt
**/
var stage = new PIXI.Container();
that.stage = stage;
var graphics = new PIXI.Graphics();
this.graphics = graphics;
var viewport_ = new PIXI.Container();
that.camera = new PIXI.Graphics();
viewport_.width = 20;
viewport_.height = 20;
viewport_.x=0;
viewport_.y=0
/** viewport border ***/
//graphics.beginFill(0x3c312b);
graphics.lineStyle(20,0x3c312b,1);
graphics.alpha = 1;
graphics.drawRect(0,0,800,(600-150));
graphics.endFill();



/** add ball(s) **/
that.camera.beginFill(0xFFFFFF);
// draw a circle, set the lineStyle to zero so the circle doesn't have an outline
that.camera.lineStyle(1.5,0x000000);
that.camera.beginFill(0xFFFFFF, 1);
that.camera.drawCircle(500, 250,hx.constants.Ball.RADIUS);
that.camera.endFill();

/** draw stadium **/
that.camera.lineStyle(3,0xFFFFFF,0.5);
that.camera.alpha = 1;

that.camera.drawRect(90,20,800-60,(600-200));
that.camera.endFill();

//draw post(s)
that.camera.lineStyle(2,0x000000);
that.camera.beginFill(0xFFCCCC, 1);
that.camera.drawCircle(90, 370,10);
that.camera.endFill();

that.camera.lineStyle(2,0x000000);
that.camera.beginFill(0xFFCCCC, 1);
that.camera.drawCircle(90, 170,10);
that.camera.endFill();

//draw nets
that.camera.lineStyle(2,0x000000);
that.camera.beginFill(0x0000FF, 1);
that.camera.arc(90-10,177+20,25,Math.PI,(3/2)*Math.PI)
that.camera.endFill();

/** second arc **/
that.camera.lineStyle(2,0x000000);
that.camera.beginFill(0x0000FF, 1);
that.camera.arc(90-10,177+173,25,Math.PI/2,(2/2)*Math.PI)
that.camera.endFill();

//goal back net
that.camera.lineStyle(2,0x000000);
that.camera.moveTo(55,197);
that.camera.lineTo(55,350);
that.camera.endFill();


/** chat and misc **/
/** add chat area **/
var chat = new PIXI.Graphics();
//var chatContent = new PIXI.DisplayObjectContainer();
chat.beginFill(0x3c312b);
chat.drawRect(0,500,400,200);
chat.endFill();
chat.x = 0;

/** chat log **/
var log = this.log = new PIXI.Text("");
log.style = hx.style;
log.y = 510;
log.x += 10;
/** user input **/
var txt = this.txt = new PixiTextInput("");
txt.style = hx.style;
txt.y = 550;
txt.x += 10;
txt.height = 45;
txt.width = 200;
//chat.addChild(txt);
chat.addChild(log);
/** misc area **/
misc = new PIXI.Graphics();
misc.beginFill(0x3c312b);
misc_pos = { x : 700, y:500};
misc.drawRect(misc_pos.x,misc_pos.y,100,200);
misc.endFill();
that.misc = misc;
/* menu buttons */
misc.beginFill(0x604E44);
misc.drawRect(misc_pos.x, 500, 75, 30);
misc.drawRect(misc_pos.x, 550, 75,30);
var menuTxt =  new PIXI.Text('Menu (esc)',{font : '15px Arial', fill : 'white', align : 'center'});
var optTxt =  new PIXI.Text('Options',{font : '15px Arial', fill : 'white', align : 'center'});
menuTxt.x = misc_pos.x;
menuTxt.y = 500;

optTxt.x = misc_pos.x;;
optTxt.y = 550;
//604E44
misc.addChild(menuTxt);
misc.addChild(optTxt);
misc.endFill();
// present **/

viewport_.addChild(that.camera);
graphics.addChild(viewport_);
graphics.addChild(chat);
graphics.addChild(misc);
stage.addChild(graphics);
};

Renderer.prototype.startRender = function ()
{
    var that = this;
    // run the render loop
    animate();
    function animate() {
        that.renderer.render(that.stage);	
        that.renderFunction();
        that.renderPlayers();
        requestAnimationFrame( animate );
    }
};

Renderer.prototype.addPlayer = function(player){
       var that = this;
       p = new Renderer.RendererPlayer(player);
        that.camera.addChild(p.graphics);
       this.players.put(player, p);
       
};
Renderer.prototype.addText = function (txt){
    this.log.text+= txt+"\n";
}
Renderer.prototype.deletePlayer = function(player){
    /** 
       var that = this;
       if(that.players.hasOwnProperty(player))
       {
           /** pixi remove child */
            // that.players[player] = undefined;
      // }
      // ***/
};
Renderer.prototype.renderPlayers = function(){
    var that = this;
    keys = that.players.keys();
    for(i in keys)
    {
        item = keys[i];
		//console.log(item.name);
        //item.update();
        point = item.point();
        x = point.x;
        y = point.y;
        
        p = that.players.get(item).graphics.position;
        p.x = x;
        p.y = y;
        
    }
};
Renderer.RendererPlayer = function (player) {
     var that = this;
		this.graphics = new PIXI.Graphics();
        that.graphics.position = new PIXI.Vector(0,0);
		that.graphics.lineStyle(3,0xFFFFFF);
		that.graphics.beginFill(0xE56E56, 1);
		//that.graphics.drawCircle(hx.constants.Player.RADIUS, 50,hx.constants.Player.RADIUS * hx.constants.World.SCALE);
        that.graphics.drawCircle(0,0,30 * hx.constants.Player.RADIUS )//* hx.constants.World.SCALE);
		that.graphics.endFill();
		//that.name_label = new PIXI.Text(player.name,{font : '25px Arial', fill : 'white', align : 'center'});
		//that.avatar_label = new PIXI.Text("",{font : '25px Arial', fill : 'white', align : 'center'});
		//that.avatar_label.x = Loader.constants.RADIUS-7.50;
		//that.avatar_label.y = (50)-15;
		//that.name_label.y = Loader.constants.RADIUS*3;
        //this.setAvatar(player.avatar);
		//that.graphics.addChild(that.avatar_label);
		//that.graphics.addChild(that.name_label);
}
Renderer.RendererPlayer.prototype.setAvatar = function (avatar) {
    //this.avatar_label.text = avatar;
};
