class Prediction extends Renderer {

constructor()
{
    super();
    this.LobbyPlayerMovable = false;
}
init  () {

    this.players = createArray(8);
    this.playersRendering = createArray(8);
    this.physics = new Physics();
    this.playbackQueue = new PlaybackQueue();
    this.playersRendering = createArray(8);
    this.loadDraw();
}

setLocalPlayerIndex(localPlayerIndex)
{
    this.localPlayerIndex = localPlayerIndex;
}
/** start rendering **/
drawObjects()
{
    this.checkUpdates();
    this.doPhysics();
    this.drawPlayers();
    this.drawBall();
}
drawPlayers()
{
    for(var i in this.players)
    {
        var player = this.playersRendering[i];
        if(player !== 0)
        {
            var point = this.players[i].point();
 
            var p = player.graphics.position;
            p.x += (point.x - p.x)  * 0.3;
            p.y += (point.y - p.y)  * 0.3;
           
        }
    }
}
drawBall ()
{
    if(this.ballRender !== 0)
    {
        var pos = this.ballRender.graphics.position;
        var point = this.ballPhysics.point();
    
        pos.x = (point.x) //- pos.x) *0.3;
        pos.y = (point.y )//- pos.y) *0.3;
    }  
}
checkUpdates ()
{
    if(this.playbackQueue.hasNext())
    {
        var it = new SyncIterator(this.playbackQueue.getNext());
        //get ball
        var ball = it.getBall()
        if(ball) 
        {
            this.ballPhysics.setPos(ball);
        }
       
        while(it.hasNext())
        {
            //updates from server found, so let's apply them
            var netObject = it.getNext();
         
            var index = netObject.id;
            this.players[index].setPos(netObject.data);
            //this.players[index].setPos(netObject.data);
            //update keyboard input
            if(index != this.localPlayerIndex)
            {
                //console.log(netObject);
                this.players[index].keys = (netObject.inputs);
            }
        }
    }
}

}

