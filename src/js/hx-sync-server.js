class Renderer {

getState()
{
    return this.state;
}
getStateSync()
{
    return this.state;
}

createPlayer (name,avatar,index)
{
	var player = new NetPlayer(name,avatar,index);
    player.physics = new PhysicsPlayer(this.physics.world);
    var p = new RendererPlayer(name,avatar);
    this.camera.addChild(p.graphics);
    this.playersRendering[index] = p;    
    this.players[index] = player;    
	console.log("* "+name+" was moved to red");
	return player;
}
buildBall ()
{
	this.ballPhysics = new DefaultBall(this.physics.world);
    this.ballRender = new RendererBall(this.ballPhysics);
    this.camera.addChild(this.ballRender.graphics);
}

init  ()
{
    this.players = createArray(8);
    this.playersRendering = createArray(8);

    this.physics = new Physics();
    /** balls */
    this.ballRender = 0;
    this.ballPhysics = 0;
    /** information for packet */
    this.state = [];
    this.sequenceNumber = 0;
    this.lastPriorities = createArray(8);
    this.inputs = createArray(8);
    this.priorities = createArray(8);
    this.indexOfPriorities = fillArray(8);
    //the number of states in the current packet
    this.stateCount = 0;
    //start drawing
    this.loadDraw();
}
loadDraw()
{
    /** initalise the renderer */
    this.renderer = PIXI.autoDetectRenderer(hx.rendering.resolution.width,hx.rendering.resolution.height, { antialias: hx.rendering.antialias});
    document.getElementById(hx.rendering.gameDivId).appendChild(this.renderer.view);
    this.renderer.backgroundColor = hx.rendering.backgroundColor;

    /** create variables and set up the stage */
    this.stage = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.viewport = new PIXI.Container();
    this.camera = new PIXI.Graphics();

    /** viewport */
    this.viewport.width = 20;
    this.viewport.height = 20;
    this.viewport.x=0;
    this.viewport.y=0;

    /** viewport border ***/
    this.graphics.lineStyle(20,0x3c312b,1);
    this.graphics.alpha = 1;
    this.graphics.drawRect(0,0,800,(600-150));
    this.graphics.endFill();

    /** display frame rate */
    this.fps =  new PIXI.Text('Menu (esc)',{font : '15px Arial', fill : 'white', align : 'center'});
    this.fps.x = 500;
    this.fps.y = 500;
    this.graphics.addChild(this.fps);

    //draw stadium
    this.drawStadium();
    //draw post(s)
    this.drawPosts();
    //draw nets
    this.drawNets();

    this.viewport.addChild(this.camera);
    this.graphics.addChild(this.viewport);
    this.stage.addChild(this.graphics);
};

/** draw the nets goals and everying in between **/
drawNets ()
{
    this.camera.lineStyle(2,0x000000);
    this.camera.beginFill(0x0000FF, 1);
    this.camera.arc(90-10,177+20,25,Math.PI,(3/2)*Math.PI)
    this.camera.endFill();
    /** second arc **/
    this.camera.arc(90-10,177+173,25,Math.PI/2,(2/2)*Math.PI)
}
drawMisc ()
{
    this.misc = new PIXI.Graphics();
    this.misc.beginFill(0x3c312b);
    misc_pos = { x : 700, y:500};
    this.misc.drawRect(misc_pos.x,misc_pos.y,100,200);
    this.misc.endFill();
    /* menu buttons */
    this.misc.beginFill(0x604E44);
    this.misc.drawRect(misc_pos.x, 500, 75, 30);
    this.misc.drawRect(misc_pos.x, 550, 75,30);
    var menuTxt =  new PIXI.Text('Menu (esc)',{font : '15px Arial', fill : 'white', align : 'center'});
    var optTxt =  new PIXI.Text('Options',{font : '15px Arial', fill : 'white', align : 'center'});

    /** set position of buttons */
    menuTxt.x = misc_pos.x;
    menuTxt.y = 500;

    optTxt.x = misc_pos.x;;
    optTxt.y = 550;
    //604E44
    this.misc.addChild(menuTxt);
    this.misc.addChild(optTxt);
    this.misc.endFill();
    this.graphics.addChild(misc);
}
drawChat ()
{
    this.chat = new PIXI.Graphics();
    this.chat.beginFill(0x3c312b);
    this.chat.drawRect(0,500,400,200);
    this.chat.endFill();
    this.chat.x = 0;

    /** chat log **/
    var log = this.log = new PIXI.Text("");
    log.style = hx.style;
    log.y = 510;
    log.x += 10;

    this.chat.addChild(log);
    that.graphics.addChild(this.chat);
}
drawPosts ()
{
    this.camera.lineStyle(2,0x000000);
    this.camera.beginFill(0xFFCCCC, 1);
    this.camera.drawCircle(90, 370,10);
    this.camera.endFill();
    this.camera.lineStyle(2,0x000000);
    this.camera.beginFill(0xFFCCCC, 1);
    this.camera.drawCircle(90, 170,10);
    this.camera.endFill();
}
drawStadium ()
{
    this.camera.lineStyle(3,0xFFFFFF,0.5);
    this.camera.alpha = 1;
    this.camera.drawRect(90,20,800-60,(600-200));
    this.camera.endFill();
}
/** start rendering **/
setFps()
{
    var that = this;
    var fps =that.frameTime;
    that.fps.text = fps;
}
startRender ()
{
    var that = this;
    animate();
    //display the fps
    setInterval(this.setFps.bind(this),500);
    
    var prevTime = 0;

    function animate(currentTime) {
        that.renderer.render(that.stage);
        that.frameTime = 1000 / (currentTime - prevTime);
        that.drawObjects(currentTime);
        prevTime = currentTime;       
        requestAnimationFrame( animate ); 
                   
     
    }
};
drawObjects(currentTime)
{
    //calculate physics
    this.doPhysics();
    //reset packet
    this.stateCount = 0;
    //calculate priorities
    this.getPriories();
    this.sortPriorities();
    /** render players/balls and make packet*/
    this.drawPlayers(currentTime);
    this.drawBall();
    //reset priorities
    this.lastPriorities = this.priorities;
}
sortPriorities()
{
    var that = this;
    this.indexOfPriorities.sort(function (a,b){
        return that.priorities[b] - that.priorities[a];
    });
}
getPriories()
{
    for(var i in this.players)
    {
        var player = this.players[i];
        if(player !== 0)
        {
            this.priorities[i] = player.getPriority();
        }
    }
}

doPhysics()
{
	for(i in this.players)
	{
		var item = this.players[i];
        if(item !== 0)
        {
	        item.update();
        }
	}
	this.physics.update();
    this.clearForces();  
}
clearForces()
{
    this.physics.clearForces();
}
getLastPriority(index)
{
    return this.lastPriorities[index];
}
setPriority(index, priority)
{
    this.priorities[index] = priority;
}
drawPlayers (currentTime)
{
    var temp = [++this.sequenceNumber]; 
    for(i in this.indexOfPriorities)
    {
        var item = this.playersRendering[i];
        //player has a graphics object that exitsts
        if(item !== 0 )
        {
            //graphics and physics information
            var point = this.players[i].point(currentTime);
            var p = item.graphics.position;

            //check if item has priority
            if(this.getLastPriority(i) > 0)
            {
                //check if fits into the packet
                if(this.stateCount < hx.MaxStateUpdatesPerPacket)
                {
                    //add index to packet
                    temp.push(i);
                    //add physics data
                    temp.push(point);
                    //add inputs
                    temp.push(this.players[i].keys);
                    //set the priority to zero
                    //this.setPriority(item,0);
                }
            }

            p.x = point.x;
            p.y = point.y;
        }
    }
    this.state = temp;
}
drawBall ()
{
    if(this.ballRender !== 0)
    {
        var pos = this.ballRender.graphics.position;
        var point = this.ballPhysics.point();
    
        pos.x = point.x;
        pos.y = point.y;    
    }  
}

}
class RendererBall {
     constructor (ball) {
    var that = this;
    this.graphics = new PIXI.Graphics();
    that.graphics.beginFill(0xFFFFFF);
    that.graphics.lineStyle(1.5,0x000000);
    that.graphics.beginFill(0xFFFFFF, 1);
    that.graphics.drawCircle(0,0,30*hx.constants.Ball.RADIUS);
    that.graphics.endFill();
}}
class RendererPlayer {
     constructor (name,avatar) {
     var that = this;
		this.graphics = new PIXI.Graphics();
        that.graphics.position = new PIXI.Vector(0,0);
		that.graphics.lineStyle(3,0xFFFFFF);
		that.graphics.beginFill(0xE56E56, 1);
		//that.graphics.drawCircle(hx.constants.Player.RADIUS, 50,hx.constants.Player.RADIUS * hx.constants.World.SCALE);
        that.graphics.drawCircle(0,0,30 * hx.constants.Player.RADIUS )//* hx.constants.World.SCALE);
		that.graphics.endFill();
		that.name_label = new PIXI.Text(name,{font : '25px Arial', fill : 'white', align : 'center'});
		//that.avatar_label = new PIXI.Text("",{font : '25px Arial', fill : 'white', align : 'center'});
		//that.avatar_label.x = Loader.constants.RADIUS-7.50;
		//that.avatar_label.y = (50)-15;
		that.name_label.y = 30 * hx.constants.Player.RADIUS;
        //this.setAvatar(player.avatar);
		//that.graphics.addChild(that.avatar_label);
		that.graphics.addChild(that.name_label);
    
    }
    updateAvatar(avatar)
    {
        this.avatar_label.txt = avatar;
    }
    
}
