
var Loader = function(){
	var that = this;
that.players =  [];
this.playerObject = function(name,avatar) {
	var that = this;
	this.name = name;
	this.avatar = avatar;
	this.graphics = new PIXI.Graphics();
	/** draw player **/
	that.graphics.beginFill(0x00FF00);
	// draw a circle, set the lineStyle to zero so the circle doesn't have an outline
	that.graphics.lineStyle(3,0xFFFFFF);
	that.graphics.beginFill(0xE56E56, 1);
	that.graphics.drawCircle(470, 90,25);
	that.graphics.endFill();
	/** add text to player **/
	that.text = new PIXI.Text('ax',{font : '24px Arial', fill : 'white', align : 'center'});
	var n = -5;
	that.text.x = (470)+n;
	that.text.y = (90)+n-5;
	that.graphics.addChild(that.text);
}
var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
document.getElementById("game-view").appendChild(renderer.view)
//renderer.backgroundColor = 0x718c5a;
renderer.backgroundColor = 0x939e7f;

// create the root of the scene graph
var stage = new PIXI.Container();
that.stage = stage;
var graphics = new PIXI.Graphics();
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
graphics.drawRoundedRect(0,0,800,(600-150),25);
graphics.endFill();
/**/
that.players.push(new that.playerObject("Enyinna","4"));

that.camera.addChild(that.players[0].graphics);


/** add ball(s) **/
that.camera.beginFill(0xFFFFFF);
// draw a circle, set the lineStyle to zero so the circle doesn't have an outline
that.camera.lineStyle(1.5,0x000000);
that.camera.beginFill(0xFFFFFF, 1);
that.camera.drawCircle(500, 250,10);
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
chat.drawRoundedRect(0,500,400,200,15);
chat.endFill();
t= new PIXI.Text('* vagrant was moved to red\n',{font : '20px Arial', fill : 'white', align : 'center'});
that.t = t;
t.y = 510;
t.x += 10;
chat.x = 20;
chat.addChild(t);
/** misc area **/
var misc = new PIXI.Graphics();
misc.beginFill(0x3c312b);
misc.drawRoundedRect(500,300,200,200);
misc.endFill();
/* menu buttons */
misc.beginFill(0x604E44);
misc.drawRoundedRect(500, 300, 150, 50, 5);
misc.drawRoundedRect(500, 300+150, 150, 50, 5);
var menuTxt =  new PIXI.Text('Menu (esc)',{font : '20px Arial', fill : 'white', align : 'center'});
var optTxt =  new PIXI.Text('Options',{font : '20px Arial', fill : 'white', align : 'center'});
menuTxt.x = 500;
menuTxt.y = 300;

optTxt.x = 500;
optTxt.y = 450;
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

// run the render loop
var acceleration = new PIXI.Vector(0,0);
var velocity = new PIXI.Vector(0,0);
that.players[0].graphics.position = new PIXI.Vector(0,0);
animate();
/*speed**/
//velocity = new PIXI.Vector(5, 0);
var oldtime = Math.floor(Date.now() / 1000);
var shit=false;


function animate() {

velocity.add(acceleration);

that.players[0].graphics.position.add(velocity);
    renderer.render(stage);	
    requestAnimationFrame( animate );
}
function Anim(e)
{
	if(e == 37){that.players[0].graphics.x--;}
				else if(e == 39){acceleration.add(0.00001, 0);}
				else if(e == 38){that.players[0].graphics.y--;}
				else if(e == 40){that.players[0].graphics.y++;}
}


	document.addEventListener('keydown', function (e) {
        if (e.keyCode > 36 && e.keyCode < 41) {

			console.log("downup")
			Anim(e.keyCode)

		}
    });
    document.addEventListener('keyup', function (e) {
			acceleration.add(-0.00001, 0);
			console.log("up");
    });
	


};

Loader.prototype.addPlayer = function(name, avatar){
	var that = this;
	var player = new that.playerObject(name,avatar);
	that.players.push(player);
	that.camera.addChild(player.graphics);
}
Loader.prototype.addText = function(text) {
	this.t.text+= text+"\n";
}