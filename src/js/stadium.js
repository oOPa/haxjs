var Stadium = function(opts,player,ball,name)
{
    if(arguments.length == 1)
    {
        this.opts = arguments[0].opts;
        this.player = arguments[0].player;
        this.ball = arguments[0].ball;
        this.name = arguments[0].name;
    }
    else
    {
        this.opts = opts;
        this.ball = ball;
        this.player = player;
        this.name = name;
    }
}   
Stadium.prototype.getHashCode = function()
{
    var str = "";
    //opts
    //ball
    str+= this.ball.FRICTION;
    str+= this.ball.RESTITUTION;
    str+= this.ball.RADIUS;
    //player
    str+= this.player.FRICTION;
    str+= this.player.RESTITUTION;
    str+= this.player.RADIUS;
    return md5(str);
}
Stadium.prototype.getPlayer = function()
{
    return this.player;
}
Stadium.prototype.getOpts = function()
{
    return this.opts;
}
Stadium.prototype.getBall = function()
{
    return this.ball;
}
Stadium.prototype.getName = function()
{
    return this.name;
}
/** Sample stadium format */
var SampleStadium = {}
SampleStadium.opts = {};
SampleStadium.name = "Sample Stadium 1";
SampleStadium.player = 
{
    FRICTION : 0
    ,RESTITUTION : 0 
    ,RADIUS : 0
}
SampleStadium.ball = 
{
    FRICTION : 0
    ,RESTITUTION : 0 
    ,RADIUS : 0
}

//var SampleStadiumObject = new Stadium(SampleStadium);

var StadiumStore = {
    "670b14728ad9902aecba32e22fa4f6bd" : SampleStadium
}

var getStadiumFromHash = function (hash)
{
    if(hash in StadiumStore)
    {
        return new Stadium(StadiumStore[hash])
    }
    else{
        return false;
    }
}
var addStadium = function (stadium)
{
    var s = new Stadium(stadium);
    var hash = s.getHashCode();
    if(getStadiumFromHash(hash))
    {
        //exists already, no need to add
    }
    else{
        //else add to store
        StadiumStore[hash] = stadium;
    }
}