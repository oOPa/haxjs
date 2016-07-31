class Renderer {

 constructor (isHost,pbp,hostPeerId){
	var that = this;
    this.players = new Hashtable();
    this.balls   = new Hashtable();
    this.physics = new Physics();
    this.init();

    this.sequence_number = 0;
    this.PlaybackQueue = new PlaybackQueue();
    this.playersByPeer = pbp;
    this.host = hostPeerId;
    this.delay = 50;
    this.nextPositionTime = 0;
}


createPlayer (name,avatar,peer)
{
	var player = new NetPlayer(name,avatar,peer);
    player.physics = new PhysicsPlayer(this.physics.world);
	this.addPlayer(player); 
	console.log("* "+player.name+" was moved to red");
    if(this.players.size() == 1)
    {
        this.me = player;
     
   
    }
   
	return player;
}
buildBall ()
{
	var ball = new DefaultBall(this.physics.world);
	this.addBall(ball);
}

init  () {
var that = this;
var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true});
this.renderer = renderer;
document.getElementById("game-view").appendChild(renderer.view)
//renderer.backgroundColor = 0x718c5a;
renderer.backgroundColor = 0x939e7f;
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
graphics.lineStyle(20,0x3c312b,1);
graphics.alpha = 1;
graphics.drawRect(0,0,800,(600-150));
graphics.endFill();


var fps =  new PIXI.Text('Menu (esc)',{font : '15px Arial', fill : 'white', align : 'center'});
fps.x = 500;
fps.y = 500;
graphics.addChild(fps);
this.fps = fps;
/** draw stadium **/
this.drawStadium();
//draw post(s)
this.drawPosts();

this.drawNets();


viewport_.addChild(that.camera);
graphics.addChild(viewport_);

stage.addChild(graphics);
};
/** draw the nets goals and everying in between **/
drawNets ()
{
    var that = this;
that.camera.lineStyle(2,0x000000);
that.camera.beginFill(0x0000FF, 1);
that.camera.arc(90-10,177+20,25,Math.PI,(3/2)*Math.PI)
that.camera.endFill();

/** second arc **/

that.camera.arc(90-10,177+173,25,Math.PI/2,(2/2)*Math.PI)

}
drawMisc ()
{
	var that =this;
	that.misc = misc = new PIXI.Graphics();
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
that.graphics.addChild(misc);
}
drawChat ()
{
	var that =this;
	var chat = that.chat = new PIXI.Graphics();
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

//chat.addChild(txt);
chat.addChild(log);
that.graphics.addChild(this.chat);
}
drawPosts ()
{
    var that = this;
    that.camera.lineStyle(2,0x000000);
    that.camera.beginFill(0xFFCCCC, 1);
    that.camera.drawCircle(90, 370,10);
    that.camera.endFill();
    that.camera.lineStyle(2,0x000000);
    that.camera.beginFill(0xFFCCCC, 1);
    that.camera.drawCircle(90, 170,10);
    that.camera.endFill();
}
drawStadium ()
{
    var that = this;
    that.camera.lineStyle(3,0xFFFFFF,0.5);
    that.camera.alpha = 1;
    that.camera.drawRect(90,20,800-60,(600-200));
    that.camera.endFill();
}
/** start rendering **/
setFps()
{
    var that = this;
    var fps =1/that.frameTime;
    that.fps.text = fps;
}
startRender ()
{
    var that = this;
    that.createSnapshot();
    animate();
    
    //display the fps
    setInterval(this.setFps.bind(this),500);
    
    var prevTime = 0;

    function animate(currentTime) {
        that.renderer.render(that.stage);
        that.frameTime = (currentTime - prevTime) / 1000;      
        prevTime = currentTime;
        that.checkUpdates();
        that.interpolate(currentTime);
        requestAnimationFrame( animate );      
    }
};

updateAvatar(player)
{
    this.players.get(player).updateAvatar(player.avatar);
}
addPlayer (player){
       var that = this;
       var p = new RendererPlayer(player);
       this.camera.addChild(p.graphics);
       this.players.put(player,p);       
};
addBall (ball){
	if(ball == null)
	{
		ball = new DefaultBall(game.physics.world);
	}
	var that = this;
       b = new RendererBall(ball);
       that.camera.addChild(b.graphics);
       this.balls.put(ball, b);
       
};

doPhysics()
{
    var keys = this.players.keys();
	for(i in keys)
	{
		var item = keys[i];
		item.update();
	}
	this.physics.update();   
}
clearForces()
{
    this.physics.clearForces();
}
checkUpdates ()
{
   if(this.PlaybackQueue.hasNext())
    {
        this.createSnapshot();
        this.nextPosition = this.PlaybackQueue.getNext();
        this.nextPositionTime = getTimeMs() + this.delay;
    }
}
interpolate (){
   var time= getTimeMs()
    if (time < this.nextPositionTime){
        //interpolate
        var it = new SnapshotIterator(this.nextPosition);
        var last = new SnapshotIterator(this.lastPosition);
        while(it.hasNext())
        {
            //debugger;
            var item = it.getNext();
            var lastPositionData = last.getObjectById(item.id);
            var player_graphics = this.getGraphicsFromId(item.id).position;
            player_graphics.x = lerp(lastPositionData.x,item.data.x,time/this.nextPositionTime);
            player_graphics.y = lerp(lastPositionData.y,item.data.y,time/this.nextPositionTime);
           
        }
    }
    else{
        //snap
        this.applySnapshot(this.nextPosition);
    }

}

createSnapshot()
{
    var temp = [0,0]; 
    let keys = this.players.keys();
    for(i in keys)
    {
        var item = keys[i];
        var player_graphics = this.players.get(item);
        temp.push(item.getPeer());    
        var p = player_graphics.graphics.position;
        var point = {x:p.x,y:p.y}
        temp.push(point);
        /** */
    
    }
    this.lastPosition = temp;
}
applySnapshot(snapshot)
{
    if(snapshot)
    {
    var it = new SnapshotIterator(snapshot);
    while(it.hasNext())
    {
        var next = it.getNext();
        var player_graphics = this.getGraphicsFromId(next.id);
        player_graphics.position.x = next.data.x;
        player_graphics.position.y = next.data.y;
    }
    }
}
getGraphicsFromId(id)
{
        var player = null;
        if(id == this.me.getPeer())
        {
            player = this.me
        }

        else
        {
        var peer = (id == "host" ? this.host : id);
        player = this.playersByPeer.get(peer);
        }

        var player_graphics = this.players.get(player).graphics;
        return player_graphics;
        //var p = player_graphics.graphics.position;;   
}

renderBalls (){
    
    var that = this;
    let keys = that.balls.keys();
    for(i in keys)
    {
		//game.logger.log("balls")
        let item = keys[i];
        //console.log(item.name);
        //item.update();
        let point = item.point();
        let x = point.x;
        let y = point.y;
        let p = that.balls.get(item).graphics.position;
        p.x = x;
        p.y = y;
        
    }
    
}}
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
     constructor (player) {
     var that = this;
		this.graphics = new PIXI.Graphics();
        that.graphics.position = new PIXI.Vector(0,0);
		that.graphics.lineStyle(3,0xFFFFFF);
		that.graphics.beginFill(0xE56E56, 1);
		//that.graphics.drawCircle(hx.constants.Player.RADIUS, 50,hx.constants.Player.RADIUS * hx.constants.World.SCALE);
        that.graphics.drawCircle(0,0,30 * hx.constants.Player.RADIUS )//* hx.constants.World.SCALE);
		that.graphics.endFill();
		that.name_label = new PIXI.Text(player.name,{font : '25px Arial', fill : 'white', align : 'center'});
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
