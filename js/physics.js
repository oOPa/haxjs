var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
/**
 * b2contactlistener
 */
//var b2ContactListener = Box2d.Dynamics.b2ContactListener;
var Physics = function()
{
	var that  = this;
	this.world = new b2World(new b2Vec2(0, 0), true);
}

Physics.Player = function (world) {
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;

    var fixDef = new b2FixtureDef();
    //fixDef.density = hx.constants.Player.DENSITY;
    fixDef.friction = hx.constants.Player.FRICTION;
    fixDef.restitution = hx.constants.Player.RESTITUTION;
    //fixDef.shape = new b2CircleShape(hx.constants.Player.RADIUS);
    fixDef.shape = new b2CircleShape(30*hx.constants.Player.RADIUS);
    bodyDef.position.x = 100 / hx.constants.World.SCALE;
    bodyDef.position.y = 100 / hx.constants.World.SCALE;
	
	//bodyDef.position.x = 0;
	//bodyDef.position.y = 0;
    bodyDef.linearDamping = hx.constants.Player.LD;
    bodyDef.angularDamping = hx.constants.Player.AD;

    this.body = world.CreateBody(bodyDef);
    this.body.CreateFixture(fixDef);
};

Physics.prototype.update = function () {
    this.world.Step(1 / 60, 10, 10);
       //this.world.Step(1 / 30, 10, 10);
    this.world.ClearForces();
    
}
Physics.deg2rad = function (deg) {
    return deg * Math.PI / 180;
};
Physics.Vec = function (deg, mag) {
    var deg = Physics.deg2rad(deg);
    this.vec = new PIXI.Vector(Math.cos(deg) * mag, Math.sin(deg) * mag);
};
Physics.Ball = function (world) {
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