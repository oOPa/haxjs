var player;
window.onload = function(){
var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
//document.body.appendChild(renderer.view);
document.getElementById("game-view").appendChild(renderer.view)
//renderer.backgroundColor = 0x718c5a;
renderer.backgroundColor = 0x939e7f;

// create the root of the scene graph
var stage = new PIXI.Container();

var graphics = new PIXI.Graphics();
var viewport_ = new PIXI.Container();
var camera = new PIXI.Graphics();
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
player = new PIXI.Graphics();
/** draw player1 **/
player.beginFill(0x00FF00);
// draw a circle, set the lineStyle to zero so the circle doesn't have an outline
player.lineStyle(3,0xFFFFFF);
player.beginFill(0xE56E56, 1);
player.drawCircle(470, 90,25);
player.endFill();
/** add text to player **/
var text = new PIXI.Text('ax',{font : '24px Arial', fill : 'white', align : 'center'});
var n = -5;
text.x = (470)+n;
text.y = (90)+n-5;
player.addChild(text);
camera.addChild(player);


/** add ball(s) **/
camera.beginFill(0xFFFFFF);
// draw a circle, set the lineStyle to zero so the circle doesn't have an outline
camera.lineStyle(1.5,0x000000);
camera.beginFill(0xFFFFFF, 1);
camera.drawCircle(500, 250,10);
camera.endFill();

/** draw stadium **/
camera.lineStyle(3,0xFFFFFF,0.5);
camera.alpha = 1;

camera.drawRect(90,20,800-60,(600-200));
camera.endFill();

//draw post(s)
camera.lineStyle(2,0x000000);
camera.beginFill(0xFFCCCC, 1);
camera.drawCircle(90, 370,10);
camera.endFill();

camera.lineStyle(2,0x000000);
camera.beginFill(0xFFCCCC, 1);
camera.drawCircle(90, 170,10);
camera.endFill();

//draw nets
camera.lineStyle(2,0x000000);
camera.beginFill(0x0000FF, 1);
camera.arc(90-10,177+20,25,Math.PI,(3/2)*Math.PI)
camera.endFill();

/** second arc **/
camera.lineStyle(2,0x000000);
camera.beginFill(0x0000FF, 1);
camera.arc(90-10,177+173,25,Math.PI/2,(2/2)*Math.PI)
camera.endFill();

//goal back net
camera.lineStyle(2,0x000000);
camera.moveTo(55,197);
camera.lineTo(55,350);
camera.endFill();


/** chat and misc **/
/** add chat area **/
var chat = new PIXI.Graphics();
//var chatContent = new PIXI.DisplayObjectContainer();
chat.beginFill(0x3c312b);
chat.drawRoundedRect(0,500,400,200,15);
chat.endFill();
t= new PIXI.Text('* vagrant was moved to red',{font : '20px Arial', fill : 'white', align : 'center'});
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

viewport_.addChild(camera);
graphics.addChild(viewport_);
graphics.addChild(chat);
graphics.addChild(misc);
stage.addChild(graphics);
console.log(text);
// run the render loop
var acceleration = new PIXI.Vector(0,0);
var velocity = new PIXI.Vector(0,0);
player.position = new PIXI.Vector(0,0);
animate();
/*speed**/
//velocity = new PIXI.Vector(5, 0);
var oldtime = Math.floor(Date.now() / 1000);
var shit=false;


function animate() {
/**
	if(shit){
	vd = new PIXI.Vector(velocity.x,velocity.y);
	//vd.* delta);
	player.position.add(velocity);
	newtime = Math.floor(Date.now() / 1000);
	
	delta = newtime - oldtime;
	oldtime = newtime;
}
**/
velocity.add(acceleration);
player.position.add(velocity);
    renderer.render(stage);	
    requestAnimationFrame( animate );
}
function Anim(e)
{
	if(e == 37){player.x--;}
				else if(e == 39){acceleration.add(0.00001, 0);}
				else if(e == 38){player.y--;}
				else if(e == 40){player.y++;}
}


	document.addEventListener('keydown', function (e) {
        if (e.keyCode > 36 && e.keyCode < 41) {
            console.log(e.keyCode);	
			console.log("downup")
			Anim(e.keyCode)

		}
    });
    document.addEventListener('keyup', function (e) {
			acceleration.add(acceleration.add(-0.01, 0));
			console.log("up");
    });
	


};
