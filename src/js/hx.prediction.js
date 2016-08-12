class Prediction extends Renderer {

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
    this.physics = new Physics();
    this.playbackQueue = new PlaybackQueue();
    this.players = createArray(8);
    this.delay = hx.delay;
    this.nextPositionTime = 0;
    this.localPlayerIndex = -1;
 
    //if client side prediction is taking place
    this.predicting = false;
    this.loadDraw();
}


/** start rendering **/

startRender ()
{
    this.createSnapshot();
    super.startRender();
};
drawObjects()
{
    this.checkUpdates();
    this.interpolate();
}
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

