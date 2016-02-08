/** init **/
window.requestAnimFrame = (function () {
    return  window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();

/** Box2D Ojects **/
var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape,
    b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

/** I dunno **/
function writeMessage(stage, message) {
    var context = stage.getContext();
    stage.clear();
    context.font = "18pt Calibri";
    context.fillStyle = "black";
    context.fillText(message, 10, 25);
}
;

/** server code **/
/** end server code **/

/** The objects needed to run this game **/

hx.Builder = function () {
    var that = this;
	
	/** Initialise game **/
    this.canvas = document.getElementById('haxball');
    this.ctx = this.canvas.getContext('2d');
    this.world = new b2World(new b2Vec2(0, 0), true);

	//set boundary for the stadium
    this.buildGround();
	//create the players
    this.buildPlayers();
	//create a ball
	this.buildBall();

	//create action listeners
    this.bindEvents();
    this.prepareDebugDraw();

    requestAnimFrame(function () {
        that.update();
    });

};

hx.Builder.prototype.prepareDebugDraw = function () {
    var debugDraw = new b2DebugDraw();
    debugDraw.SetSprite(this.ctx);
    debugDraw.SetDrawScale(hx.constants.World.SCALE);
    debugDraw.SetFillAlpha(1);
    debugDraw.SetLineThickness(1.0);
    debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
    this.world.SetDebugDraw(debugDraw);
}

hx.Builder.prototype.update = function () {
    var that = this;
    this.updatePlayers();
    this.world.Step(1 / 60, 10, 10);
    this.world.DrawDebugData();
    this.world.ClearForces();
    requestAnimFrame(function () {
        that.update();
    });
}




hx.Builder.prototype.buildGround = function () {
    var fixDef = new b2FixtureDef();
    fixDef.density = hx.constants.Ground.DENSITY;
    fixDef.friction = hx.constants.Ground.FRICTION;
    fixDef.restitution = hx.constants.Ground.RESTITUTION;
    fixDef.shape = new b2PolygonShape();

    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_staticBody;

    for (var b in hx.grounds.G1) {
        b = hx.grounds.G1[b];
        bodyDef.position.x = b[0] / hx.constants.World.SCALE;
        bodyDef.position.y = b[1] / hx.constants.World.SCALE;
        fixDef.shape.SetAsBox((b[2] / hx.constants.World.SCALE), (b[3] / hx.constants.World.SCALE));
        this.world.CreateBody(bodyDef).CreateFixture(fixDef);
    }
};


hx.Builder.prototype.buildPlayers = function () {
	this.players = [];
    this.players.push(new hx.Player(this.world));
}

hx.Builder.prototype.buildBall = function () {
    this.ball = new hx.Ball(this.world);
}

hx.Builder.prototype.bindEvents = function () {
    var that = this;
    that.vec = new hx.Vec(0, 0);
    document.addEventListener('keydown', function (e) {
        if (e.keyCode > 36 && e.keyCode < 41) {
            that.players[0].keys[hx.constants.Directions[e.keyCode]] = true;			
        }
    });
    document.addEventListener('keyup', function (e) {
        that.players[0].keys[hx.constants.Directions[e.keyCode]] = false;
    });
};

hx.Builder.prototype.updatePlayers = function () {
	
	for(var x in this.players)
	{
		var vec= new b2Vec2(0, 0);
		var player = this.players[x];
		player.keys.forEach(function (key, i) {
			if (key) {
				var vec2 = new hx.Vec(i * -90, hx.constants.Player.MAG);
				vec.Add(vec2.vec);
			}
		});
	
		if (vec.Length() > 0)
		{
			player.body.ApplyForce(vec, player.body.GetWorldCenter());
		}
	}
};


hx.Vec = function (deg, mag) {
    var deg = deg2rad(deg);
    this.vec = new b2Vec2(Math.cos(deg) * mag, Math.sin(deg) * mag);
};

deg2rad = function (deg) {
    return deg * Math.PI / 180;
};

hx.Player = function (world) {
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;

    var fixDef = new b2FixtureDef();
    fixDef.density = hx.constants.Player.DENSITY;
    fixDef.friction = hx.constants.Player.FRICTION;
    fixDef.restitution = hx.constants.Player.RESTITUTION;
    fixDef.shape = new b2CircleShape(hx.constants.Player.RADIUS);

    bodyDef.position.x = 100 / hx.constants.World.SCALE;
    bodyDef.position.y = 100 / hx.constants.World.SCALE;

    bodyDef.linearDamping = hx.constants.Player.LD;
    bodyDef.angularDamping = hx.constants.Player.AD;

    this.body = world.CreateBody(bodyDef);
    this.body.CreateFixture(fixDef);
	this.keys = [false,false,false,false];
};

hx.Ball = function (world) {
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;

    var fixDef = new b2FixtureDef();
    fixDef.density = hx.constants.Ball.DENSITY;
    fixDef.friction = hx.constants.Ball.FRICTION;
    fixDef.restitution = hx.constants.Ball.RESTITUTION;
    fixDef.shape = new b2CircleShape(hx.constants.Ball.RADIUS);

    bodyDef.position.x = 100 / hx.constants.World.SCALE;
    bodyDef.position.y = 100 / hx.constants.World.SCALE;

    bodyDef.linearDamping = hx.constants.Ball.LD;
    bodyDef.angularDamping = hx.constants.Ball.AD;

    this.body = world.CreateBody(bodyDef);
    this.body.CreateFixture(fixDef);
}


window.onload = function () {
    //window.hxp = new hx.Builder();
};