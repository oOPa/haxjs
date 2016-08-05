class Prediction extends Renderer {

init  () {

    this.players = createArray(8);
    this.playersRendering = createArray(8);
    this.physics = new Physics();
    this.playbackQueue = new PlaybackQueue();
    this.playersRendering = createArray(8);
    this.loadDraw();
}


/** start rendering **/
drawObjects()
{
    this.checkUpdates();
    this.doPhysics();
}

checkUpdates ()
{
    if(this.playbackQueue.hasNext())
    {
        var it = new SyncIterator(this.nextPosition);
        
    }
}

}

