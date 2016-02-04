window.onload = function(){
var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
//document.body.appendChild(renderer.view);
document.getElementById("game-view").appendChild(renderer.view)
renderer.backgroundColor = 0x718c5a;

// create the root of the scene graph
var stage = new PIXI.Container();

//stage.interactive = true;

var graphics = new PIXI.Graphics();
var player = new PIXI.Graphics();
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
graphics.addChild(player);


/** add ball(s) **/
graphics.beginFill(0xFFFFFF);
// draw a circle, set the lineStyle to zero so the circle doesn't have an outline
graphics.lineStyle(1.5,0x000000);
graphics.beginFill(0xFFFFFF, 1);
graphics.drawCircle(500, 250,10);
graphics.endFill();

/** draw stadium **/
graphics.lineStyle(3,0xFFFFFF,0.5);
graphics.alpha = 1;

graphics.drawRect(90,20,800-60,(600-60));
graphics.endFill();

//draw post(s)
graphics.lineStyle(2,0x000000);
graphics.beginFill(0xFFCCCC, 1);
graphics.drawCircle(90, 370,10);
graphics.endFill();

graphics.lineStyle(2,0x000000);
graphics.beginFill(0xFFCCCC, 1);
graphics.drawCircle(90, 170,10);
graphics.endFill();

//draw nets
graphics.lineStyle(2,0x000000);
graphics.beginFill(0x0000FF, 1);
graphics.arc(90-10,177+20,25,Math.PI,(3/2)*Math.PI)
graphics.endFill();

/** second arc **/
graphics.lineStyle(2,0x000000);
graphics.beginFill(0x0000FF, 1);
graphics.arc(90-10,177+173,25,Math.PI/2,(2/2)*Math.PI)
graphics.endFill();

//goal back net
graphics.lineStyle(2,0x000000);
graphics.moveTo(55,197);
graphics.lineTo(55,350);
graphics.endFill();


/** chat and misc **/
/** add chat area **/
var chat = new PIXI.Graphics();
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
misc.beginFill(0x0000FF);
misc.drawRect(500,300,200,200);
misc.endFill();
/* menu buttons */
misc.beginFill(0x00FF00);
misc.drawRoundedRect(500, 300, 150, 50, 5);
misc.drawRoundedRect(500, 300+150, 150, 50, 5);
misc.endFill();
// present **/
graphics.addChild(chat);
graphics.addChild(misc);
stage.addChild(graphics);

// run the render loop
animate();

function animate() {

    renderer.render(stage);	
    requestAnimationFrame( animate );
}
function Anim(e)
{
	if(e == 37){player.x--;}
				else if(e == 39){player.x++;}
				else if(e == 38){player.y--;}
				else if(e == 40){player.y++;}
}


	document.addEventListener('keydown', function (e) {
        if (e.keyCode > 36 && e.keyCode < 41) {
            console.log(e.keyCode);	
			Anim(e.keyCode)

		}
    });
    document.addEventListener('keyup', function (e) {
			Anim(e.keyCode);
            //dx = 0;
			//dy = 0;
    });
	


};
