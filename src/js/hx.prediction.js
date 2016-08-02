class Renderer {

 constructor (){
	var that = this;
    this.balls   = new Hashtable();
    this.physics = new Physics();
    this.init();

    this.playbackQueue = new PlaybackQueue();
    this.players = createArray(8);
    this.delay = hx.delay;
    this.nextPositionTime = 0;
    this.localPlayerIndex = -1;

    //if client side prediction is taking place
    this.predicting = false;
}

createPlayer (name,avatar,index)
{
    var that = this;
    var p = new RendererPlayer(name,avatar);
    this.camera.addChild(p.graphics);
    this.players[index] = p;  
    console.log("* "+name+" was moved to red");   
}

createLocalPlayer (name,avatar,index)
{
    this.createPlayer(name,avatar,index);
    this.me = new NetPlayer;
    this.localPlayer = new NetPlayer();
    this.localPlayer.physics = new PhysicsPlayer(this.physics.world);
    this.localPlayerIndex = index;
    return this.localPlayer;
}

init  () {
var that = this;
this. renderer = PIXI.autoDetectRenderer(hx.resolution.width, hx.resolution.height, { antialias: true});
document.getElementById("game-view").appendChild(this.renderer.view)
//renderer.backgroundColor = 0x718c5a;
this.renderer.backgroundColor = 0x939e7f;
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
fps.x = 50;
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
    var fps = that.frameTime;
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
        that.frameTime = 1000 / (currentTime - prevTime);      
        prevTime = currentTime;
        that.doPhysics();
        that.checkUpdates();
        that.interpolate(currentTime);
        requestAnimationFrame( animate );      
    }
};

doPhysics()
{
    if(hx.clientSidePredictionEnabled && this.hasLocalPlayer())
    {
        this.predicting = this.localPlayer.moving;
        if(this.predicting)
        {
            //this.localPlayer.update();
            this.physics.update();   
            this.clearForces();
        }
    }
}
hasLocalPlayer ()
{
    return (this.localPlayerIndex != -1) && (this.players[this.localPlayerIndex] !== 0)
}
clearForces()
{
    this.physics.clearForces();
}
checkUpdates ()
{
   if(this.playbackQueue.hasNext())
    {
        this.createSnapshot();
        this.nextPosition = this.playbackQueue.getNext();
        this.nextPositionTime = getTimeMs() + this.delay;
        this.next = new SnapshotIterator(this.nextPosition);
        //stop client side prediction to be able to update position
        this.predicting = false;
    }
}
interpolate (){
    var time = getTimeMs()
    if (time < this.nextPositionTime){
        //interpolate
        while(this.next.hasNext())
        {
            var nextGameObject = this.next.getNext();
            var lastGameObject = this.last.getNext();

            //check if its the localPlayer and client side prediction is happening
            if(hx.clientSidePredictionEnabled && (nextGameObject.id == this.localPlayerIndex) && this.predicting)
            {
                    //update player via physics engine as opposed to the server update
                    this.drawPlayerFromPhysics();
            }
            //always runs. needs a fix;
            else if(lastGameObject)
            {
                //its not the local player check if there is an object to interpolate from.
                var player_graphics = this.getGraphicsFromId(nextGameObject.id).position;
                player_graphics.x = lerp(lastGameObject.data.x,nextGameObject.data.x,time/this.nextPositionTime);
                player_graphics.y = lerp(lastGameObject.data.y,nextGameObject.data.y,time/this.nextPositionTime);
            }

           
        }
        this.next.reset();
        this.last.reset();
    }
    else{
        this.applySnapshot(this.nextPosition);
    }
}
drawPlayerFromPhysics()
{
    var player_graphics = this.players[this.localPlayerIndex];
    var p = player_graphics.graphics.position;
    var point = this.localPlayer.point();
    p.x = point.x;
    p.y = point.y;
}
syncPhysicsToRender()
{
    var player_graphics = this.players[this.localPlayerIndex];
    var p = player_graphics.graphics.position;
    this.localPlayer.setPos(p);
}
createSnapshot()
{
    var temp = [0,0]; 
    for(var i in this.players)
    {
        if(this.players[i] != 0)
        {
            temp.push(i);    

            if(this.hasLocalPlayer() && i == this.localPlayerIndex)
            {
                
                var player = this.localPlayer;
                player.stop();
                temp.push(player.point());
                //this.drawPlayerFromPhysics();
                this.syncPhysicsToRender();
            }
            else
            {
                var player_graphics = this.players[i];
                var p = player_graphics.graphics.position;
                var point = {x:p.x,y:p.y}
                temp.push(point);
            }

        }
    }
    this.lastPosition = temp;
    this.last = new SnapshotIterator(this.lastPosition);
}
applySnapshot(snapshot)
{
    if(snapshot)
    {
        var it = new SnapshotIterator(snapshot);
        while(it.hasNext())
        {
            var next = it.getNext();
            //set co-ordinates in physics engine if localPlayer
            if(next.data.id == this.localPlayerIndex)
            {
                this.localPlayer.setPos(next.data);
            }
            //set co-ordinates of rendering object
            var player_graphics = this.getGraphicsFromId(next.id);
            player_graphics.position.x = next.data.x;
            player_graphics.position.y = next.data.y;
        }
    }
}
getGraphicsFromId(id)
{
        var player_graphics = this.players[id].graphics;
        return player_graphics;
}
}

class RendererPlayer {
     constructor (name) {
     var that = this;
		this.graphics = new PIXI.Graphics();
        that.graphics.position = new PIXI.Vector(0,0);
		that.graphics.lineStyle(3,0xFFFFFF);
		that.graphics.beginFill(0xE56E56, 1);
        that.graphics.drawCircle(0,0,30 * hx.constants.Player.RADIUS )//* hx.constants.World.SCALE);
		that.graphics.endFill();
		that.name_label = new PIXI.Text(name,{font : '25px Arial', fill : 'white', align : 'center'});
		that.name_label.y = 30 * hx.constants.Player.RADIUS;
		that.graphics.addChild(that.name_label);
    }
    updateAvatar(avatar)
    {
        this.avatar_label.txt = avatar;
    }
    
}
