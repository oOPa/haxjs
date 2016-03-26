var Loader = function(){
	var that = this;
	that.keys = [false,false,false,false];
	that.Directions = {
    39:0,
    40:3,
    37:2,
    38:1
}
	that.physics = new Physics();
	that.players =  [];
	this.playerObject = function(name,avatar,world) {
        var that = this;
        that.physics = new Physics.hxPlayer(world);

		this.name = name;
		//this.avatar = avatar.substr(0,2);
		this.graphics = new PIXI.Graphics();
		/** draw player **/
		/* dunno what this does */
		//that.graphics.beginFill(0x00FF00);
		/** player border **/
		that.graphics.lineStyle(3,0xFFFFFF);
		/** player inner color **/
		that.graphics.beginFill(0xE56E56, 1);
		/** draw the actual circle **/
		that.graphics.drawCircle(Loader.constants.RADIUS, 50,Loader.constants.RADIUS);
		that.graphics.endFill();
		/** add text to player and add name**/
		/** 
			TODO find way to align avatar and names
		**/
		that.name_label = new PIXI.Text(name,{font : '25px Arial', fill : 'white', align : 'center'});
		that.avatar_label = new PIXI.Text("a",{font : '25px Arial', fill : 'white', align : 'center'});
		
		that.avatar_label.x = Loader.constants.RADIUS-7.50;
		that.avatar_label.y = (50)-15;
		
		that.name_label.y = Loader.constants.RADIUS*3;
		
		
		that.graphics.addChild(that.avatar_label);
		that.graphics.addChild(that.name_label);
	}
var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
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
				txt
				
			misc
				menuTxt
				optTxt
**/
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
graphics.drawRect(0,0,800,(600-150));
graphics.endFill();
/*create player 1*/
that.players.push(new that.playerObject("vagrant","4",that.physics.world));
//new that.playerObject("hi",2);
that.controller = that.players[0];
//that.controller = that.addPlayer("hi",2);
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
chat.drawRect(0,500,400,200);
chat.endFill();

txt= new PIXI.Text('* vagrant was moved to red\n',{font : '20px Arial', fill : 'white', align : 'center'});
that.txt = txt;
txt.y = 510;
txt.x += 10;
chat.x = 0;

chat.addChild(txt);
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

// run the render loop
//that.animatorObject = new Animator(that.players[0]);
var acceleration = new PIXI.Vector(0,0);
var velocity = new PIXI.Vector(0,0);
//Allow the use of vectors
//that.players[0].graphics.position = new PIXI.Vector(0,0);
animate();
/*speed**/
//velocity = new PIXI.Vector(5, 0);
var oldtime = Math.floor(Date.now() / 1000);
var shit=false;

Vec = function (deg, mag) {
    var deg = deg2rad(deg);
    this.vec = new PIXI.Vector(Math.cos(deg) * mag, Math.sin(deg) * mag);
};
deg2rad = function (deg) {
    return deg * Math.PI / 180;
};

function forces()
{
	var vec = new PIXI.Vector(0, 0);
	that.keys.forEach(function (key, i) {
	if (key) {
		var vec2 = new Vec(i * -90,200);
		vec.add(vec2.vec);
	}
	});

	if (vec.length() > 0)
	{
		//player.body.ApplyForce(vec, player.body.GetWorldCenter());
		that.controller.physics.body.ApplyForce(vec, that.controller.physics.body.GetWorldCenter());
		//that.players[0].graphics.position.add(vec);
		//velocity.add(vec);
	}
}
this.physics.addColl
/** BACKDOORS */
window.vagrant = this.players[0];
window.onyema = this.addPlayer("Onyema",2);
window.switchp = function()
{
    window.game.controller = window.game.controller == window.vagrant ? window.onyema : window.vagrant;
}
function animate() {

velocity.add(acceleration);
//that.players[0].graphics.position.add(velocity);
    renderer.render(stage);	
	forces();
	that.physics.update();
	v=that.controller.physics.body.GetPosition();
    //console.log(that.controller.physics);
    that.controller.graphics.position.x = v.x;
    that.controller.graphics.position.y = v.y;
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
            that.keys[that.Directions[e.keyCode]] = true;		
			console.log(e.keyCode);
        }
    });
    document.addEventListener('keyup', function (e) {
            that.keys[that.Directions[e.keyCode]] = false;			
			console.log(e.keyCode);
            if(e.keyCode == 17){window.switchp();}
    });

};

Loader.prototype.addPlayer = function(name, avatar){
	var that = this;
	var player = new that.playerObject(name,avatar,that.physics.world);
	that.players.push(player);
	that.camera.addChild(player.graphics);
    return player;
}
Loader.prototype.addText = function(txt) {
	this.txt.text+= txt+"\n";
}
Loader.constants = {
	RADIUS : 25
};

var Stadium = function()
{
	/** Players **/
}
