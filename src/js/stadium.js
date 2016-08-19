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
var StadiumIterator = function(stadiumObject)
{
    this.stadium = stadiumObject;
}
StadiumIterator.prototype.getName = function()
{
    return this.stadium["name"];
}
StadiumIterator.prototype.getSize = function()
{
    var i = {};
    i.width = this.stadium["width"];
    i.height = this.stadium["height"];
    return i;
}
StadiumIterator.prototype.getBackground = function()
{
    return this.stadium["bg"];
}
StadiumIterator.prototype.getSpawnDistance = function()
{
    return this.stadium["spawnDistance"];
}
StadiumIterator.prototype.getVertexes = function()
{
    return this.stadium["vertexes"];
}
StadiumIterator.prototype.getSegments = function()
{
    return this.stadium["segments"];
}
StadiumIterator.prototype.getGoals = function()
{
    return this.stadium["goals"];
}
StadiumIterator.prototype.getDiscs = function()
{
    return this.stadium["discs"];
}
StadiumIterator.prototype.getPlanes = function()
{
    return this.stadium["planes"];
}
StadiumIterator.prototype.getTraits = function()
{
    return this.stadium["traits"];
}

var ClassicStadium = {
	"name" : "Classic",
	
	"width" : 420,
	"height" : 200,
	
	"spawnDistance" : 170,
	
	"bg" : { "type" : "grass", "width" : 370, "height" : 170, "kickOffRadius" : 75, "cornerRadius" : 0 },

	"vertexes" : [
		{ "x" : -370, "y" : 170,  "trait" : "ballArea" },
		{ "x" : -370, "y" : 64,   "trait" : "ballArea" },
		{ "x" : -370, "y" : -64,  "trait" : "ballArea" },
		{ "x" : -370, "y" : -170, "trait" : "ballArea" },
		
		{ "x" : 370, "y" : 170,  "trait" : "ballArea" },
		{ "x" : 370, "y" : 64,   "trait" : "ballArea" },
		{ "x" : 370, "y" : -64,  "trait" : "ballArea" },
		{ "x" : 370, "y" : -170, "trait" : "ballArea" },
		
		{ "x" : 0, "y" :  200, "trait" : "kickOffBarrier" },
		{ "x" : 0, "y" :   75, "trait" : "kickOffBarrier" },
		{ "x" : 0, "y" :  -75, "trait" : "kickOffBarrier" },
		{ "x" : 0, "y" : -200, "trait" : "kickOffBarrier" },
		
		{ "x" : -380, "y" : -64, "trait" : "goalNet" },
		{ "x" : -400, "y" : -44, "trait" : "goalNet" },
		{ "x" : -400, "y" :  44, "trait" : "goalNet" },
		{ "x" : -380, "y" :  64, "trait" : "goalNet" },
		
		{ "x" : 380, "y" : -64, "trait" : "goalNet" },
		{ "x" : 400, "y" : -44, "trait" : "goalNet" },
		{ "x" : 400, "y" :  44, "trait" : "goalNet" },
		{ "x" : 380, "y" :  64, "trait" : "goalNet" }
	],
	
	"segments" : [
		{ "v0" : 0, "v1" : 1, "trait" : "ballArea" },
		{ "v0" : 2, "v1" : 3, "trait" : "ballArea" },
		{ "v0" : 4, "v1" : 5, "trait" : "ballArea" },
		{ "v0" : 6, "v1" : 7, "trait" : "ballArea" },
		
		{ "v0" : 12, "v1" : 13, "trait" : "goalNet", "curve" : -90 },
		{ "v0" : 13, "v1" : 14, "trait" : "goalNet" },
		{ "v0" : 14, "v1" : 15, "trait" : "goalNet", "curve" : -90 },
		
		{ "v0" : 16, "v1" : 17, "trait" : "goalNet", "curve" : 90 },
		{ "v0" : 17, "v1" : 18, "trait" : "goalNet" },
		{ "v0" : 18, "v1" : 19, "trait" : "goalNet", "curve" : 90 },
		
		{ "v0" : 8, "v1" : 9, "trait" : "kickOffBarrier" },
		{ "v0" : 9, "v1" : 10, "trait" : "kickOffBarrier", "curve" : 180, "cGroup" : ["blueKO"] },
		{ "v0" : 9, "v1" : 10, "trait" : "kickOffBarrier", "curve" : -180, "cGroup" : ["redKO"] },
		{ "v0" : 10, "v1" : 11, "trait" : "kickOffBarrier" }
	],
	
	"goals" : [
		{ "p0" : [-370, 64], "p1" : [-370,-64], "team" : "red" },
		{ "p0" : [370, 64], "p1" : [370,-64], "team" : "blue" }
	],
	
	"discs" : [
		{ "pos" : [-370,  64], "trait" : "goalPost", "color" : "FFCCCC" },
		{ "pos" : [-370, -64], "trait" : "goalPost", "color" : "FFCCCC" },
		{ "pos" : [ 370,  64], "trait" : "goalPost", "color" : "CCCCFF" },
		{ "pos" : [ 370, -64], "trait" : "goalPost", "color" : "CCCCFF" }
	],
	
	"planes" : [
		{ "normal" : [0, 1], "dist" : -170, "trait" : "ballArea" },
		{ "normal" : [0,-1], "dist" : -170, "trait" : "ballArea" },
		{ "normal" : [ 0, 1], "dist" : -200, "bCoef" : 0.1 },
		{ "normal" : [ 0,-1], "dist" : -200, "bCoef" : 0.1 },
		{ "normal" : [ 1, 0], "dist" : -420, "bCoef" : 0.1 },
		{ "normal" : [-1, 0], "dist" : -420, "bCoef" : 0.1 }
	],
	
	"traits" : {
		"ballArea" : { "vis" : false, "bCoef" : 1, "cMask" : ["ball"] },
		"goalPost" : { "radius" : 8, "invMass" : 0, "bCoef" : 0.5 },
		"goalNet" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["ball"] }, 
		"kickOffBarrier" : { "vis" : false, "bCoef" : 0.1, "cGroup" : ["redKO", "blueKO"], "cMask" : ["red", "blue"] }
	}
}

function calculate_arc(a, b, curve){
    var arc = {};

    if(curve === 0)
        return arc;

    if(curve < 0){
        curve = -curve;
        var c = a;
        a = b;
        b = c;
    }

    var c = [b[0] - a[0], b[1] - a[1]];
    var d = [
        a[0] + c[0] / 2,
        a[1] + c[1] / 2
    ];
    var nc = norm(c);

    if(curve == 180){
        arc.radius = nc/2;
        arc.center = d;
        arc.from = angle_to(d, a);
        arc.to = angle_to(d, b);
        return arc;
    }

    // |a-b| / sin A = r / sin (90 - A/2)
    var angle = curve * Math.PI / 180;
    var spa2 = Math.sin(Math.PI/2 - angle/2);
    var radius = Math.abs(nc * spa2 / Math.sin(angle));
    
    
    var cp = normalise([c[1], -c[0]]);

    var l = Math.sqrt((nc*nc/4) + radius*radius - nc*radius*Math.cos(Math.PI/2 - angle/2));

    if(curve > 180)
        l = -l;

    arc.radius = radius;
    
    arc.center = [
        d[0] - cp[0] * l,
        d[1] - cp[1] * l
    ];

    arc.from = angle_to(arc.center, a);
    arc.to = angle_to(arc.center, b);
    
    return arc;
}

function norm(v){
    return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}
function normalise(v){
    var k = norm(v);
    
    var x = v[0] / k;
    var y = v[1] / k;
    
    return [x,y];
}
function angle_to(o, p){
    return Math.atan2(p[1]-o[1], p[0]-o[0]);
}

var ez={
	"name" : "Easy",
	
	"width" : 420,
	"height" : 200,
	
	"spawnDistance" : 170,
	
	"bg" : { "type" : "grass", "width" : 370, "height" : 170, "kickOffRadius" : 75, "cornerRadius" : 0 },

	"vertexes" : [
		{ "x" : -370, "y" : 170,  "trait" : "ballArea" },
		{ "x" : -370, "y" : 90,   "trait" : "ballArea" },
		{ "x" : -370, "y" : -90,  "trait" : "ballArea" },
		{ "x" : -370, "y" : -170, "trait" : "ballArea" },
		
		{ "x" : 370, "y" : 170,  "trait" : "ballArea" },
		{ "x" : 370, "y" : 90,   "trait" : "ballArea" },
		{ "x" : 370, "y" : -90,  "trait" : "ballArea" },
		{ "x" : 370, "y" : -170, "trait" : "ballArea" },
		
		{ "x" : 0, "y" :  200, "trait" : "kickOffBarrier" },
		{ "x" : 0, "y" :   75, "trait" : "kickOffBarrier" },
		{ "x" : 0, "y" :  -75, "trait" : "kickOffBarrier" },
		{ "x" : 0, "y" : -200, "trait" : "kickOffBarrier" },
		
		{ "x" : -380, "y" : -90, "trait" : "goalNet" },
		{ "x" : -400, "y" : -70, "trait" : "goalNet" },
		{ "x" : -400, "y" :  70, "trait" : "goalNet" },
		{ "x" : -380, "y" :  90, "trait" : "goalNet" },
		
		{ "x" : 380, "y" : -90, "trait" : "goalNet" },
		{ "x" : 400, "y" : -70, "trait" : "goalNet" },
		{ "x" : 400, "y" :  70, "trait" : "goalNet" },
		{ "x" : 380, "y" :  90, "trait" : "goalNet" }
	],
	
	"segments" : [
		{ "v0" : 0, "v1" : 1, "trait" : "ballArea" },
		{ "v0" : 2, "v1" : 3, "trait" : "ballArea" },
		{ "v0" : 4, "v1" : 5, "trait" : "ballArea" },
		{ "v0" : 6, "v1" : 7, "trait" : "ballArea" },
		
		{ "v0" : 12, "v1" : 13, "trait" : "goalNet", "curve" : -90 },
		{ "v0" : 13, "v1" : 14, "trait" : "goalNet" },
		{ "v0" : 14, "v1" : 15, "trait" : "goalNet", "curve" : -90 },
		
		{ "v0" : 16, "v1" : 17, "trait" : "goalNet", "curve" : 90 },
		{ "v0" : 17, "v1" : 18, "trait" : "goalNet" },
		{ "v0" : 18, "v1" : 19, "trait" : "goalNet", "curve" : 90 },
		
		{ "v0" : 8, "v1" : 9, "trait" : "kickOffBarrier" },
		{ "v0" : 9, "v1" : 10, "trait" : "kickOffBarrier", "curve" : 180, "cGroup" : ["blueKO"] },
		{ "v0" : 9, "v1" : 10, "trait" : "kickOffBarrier", "curve" : -180, "cGroup" : ["redKO"] },
		{ "v0" : 10, "v1" : 11, "trait" : "kickOffBarrier" }
	],
	
	"goals" : [
		{ "p0" : [-370, 90], "p1" : [-370,-90], "team" : "red" },
		{ "p0" : [370, 90], "p1" : [370,-90], "team" : "blue" }
	],
	
	"discs" : [
		{ "pos" : [-370,  90], "trait" : "goalPost", "color" : "FFCCCC" },
		{ "pos" : [-370, -90], "trait" : "goalPost", "color" : "FFCCCC" },
		{ "pos" : [ 370,  90], "trait" : "goalPost", "color" : "CCCCFF" },
		{ "pos" : [ 370, -90], "trait" : "goalPost", "color" : "CCCCFF" }
	],
	
	"planes" : [
		{ "normal" : [0, 1], "dist" : -170, "trait" : "ballArea" },
		{ "normal" : [0,-1], "dist" : -170, "trait" : "ballArea" },
		{ "normal" : [ 0, 1], "dist" : -200, "bCoef" : 0.1 },
		{ "normal" : [ 0,-1], "dist" : -200, "bCoef" : 0.1 },
		{ "normal" : [ 1, 0], "dist" : -420, "bCoef" : 0.1 },
		{ "normal" : [-1, 0], "dist" : -420, "bCoef" : 0.1 }
	],
	
	"traits" : {
		"ballArea" : { "vis" : false, "bCoef" : 1, "cMask" : ["ball"] },
		"goalPost" : { "radius" : 8, "invMass" : 0, "bCoef" : 0.5 },
		"goalNet" : { "vis" : true, "bCoef" : 0.1, "cMask" : ["ball"] }, 
		"kickOffBarrier" : { "vis" : false, "bCoef" : 0.1, "cGroup" : ["redKO", "blueKO"], "cMask" : ["red", "blue"] }
	}
}
var spice = {"name":"SpIceball by GeleBanaan from HaxMaps","width":900,"height":540,"spawnDistance":350,"bg":{"type":"hockey","width":550,"height":240,"kickOffRadius":80,"cornerRadius":0},"vertexes":[{"x":-550,"y":240,"trait":"ballArea"},{"x":-550,"y":80,"trait":"ballArea"},{"x":-550,"y":-80,"trait":"ballArea"},{"x":-550,"y":-240,"trait":"ballArea"},{"x":550,"y":240,"trait":"ballArea"},{"x":550,"y":80,"trait":"ballArea"},{"x":550,"y":-80,"trait":"ballArea"},{"x":550,"y":-240,"trait":"ballArea"},{"x":0,"y":550,"trait":"kickOffBarrier"},{"x":0,"y":80,"trait":"kickOffBarrier"},{"x":0,"y":-80,"trait":"kickOffBarrier"},{"x":0,"y":-550,"trait":"kickOffBarrier"},{"x":-560,"y":-80,"trait":"goalNet"},{"x":-580,"y":-60,"trait":"goalNet"},{"x":-580,"y":60,"trait":"goalNet"},{"x":-560,"y":80,"trait":"goalNet"},{"x":560,"y":-80,"trait":"goalNet"},{"x":580,"y":-60,"trait":"goalNet"},{"x":580,"y":60,"trait":"goalNet"},{"x":560,"y":80,"trait":"goalNet"}],"segments":[{"v0":0,"v1":1,"trait":"ballArea"},{"v0":2,"v1":3,"trait":"ballArea"},{"v0":4,"v1":5,"trait":"ballArea"},{"v0":6,"v1":7,"trait":"ballArea"},{"v0":12,"v1":13,"trait":"goalNet","curve":-90},{"v0":13,"v1":14,"trait":"goalNet"},{"v0":14,"v1":15,"trait":"goalNet","curve":-90},{"v0":16,"v1":17,"trait":"goalNet","curve":90},{"v0":17,"v1":18,"trait":"goalNet"},{"v0":18,"v1":19,"trait":"goalNet","curve":90},{"v0":8,"v1":9,"trait":"kickOffBarrier"},{"v0":9,"v1":10,"trait":"kickOffBarrier","curve":180,"cGroup":["blueKO"]},{"v0":9,"v1":10,"trait":"kickOffBarrier","curve":-180,"cGroup":["redKO"]},{"v0":10,"v1":11,"trait":"kickOffBarrier"}],"goals":[{"p0":[-550,80],"p1":[-550,-80],"team":"red"},{"p0":[550,80],"p1":[550,-80],"team":"blue"}],"discs":[{"pos":[-550,80],"trait":"goalPost","color":"FFFFFF"},{"pos":[-550,-80],"trait":"goalPost","color":"FFFFFF"},{"pos":[550,80],"trait":"goalPost","color":"FFFFFF"},{"pos":[550,-80],"trait":"goalPost","color":"FFFFFF"}],"planes":[{"normal":[0,1],"dist":-240,"trait":"ballArea"},{"normal":[0,-1],"dist":-240,"trait":"ballArea"},{"normal":[0,1],"dist":-540,"bCoef":0.1},{"normal":[0,-1],"dist":-540,"bCoef":0.1},{"normal":[1,0],"dist":-900,"bCoef":0.1},{"normal":[-1,0],"dist":-900,"bCoef":0.1}],"traits":{"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":0.5},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["ball"]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]}},"ballPhysics":{"radius":10,"bCoef":0.95,"damping":0.999,"invMass":1,"color":"FFFFFF","cMask":["all"],"cGroup":["ball"]},"playerPhysics":{"bCoef":0.95,"invMass":0.5,"damping":0.9995,"acceleration":0.025,"kickingAcceleration":0.0175,"kickingDamping":0.9995,"kickStrength":5}}
//window.classicStadiumIterator = new StadiumIterator(ClassicStadium);
window.classicStadiumIterator = new StadiumIterator(spice);