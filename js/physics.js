var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;

var Physics = function()
{
	var that  = this;
	this.world = new b2World(new b2Vec2(0, 0), true);
	this.buildGround();
}

Physics.hxPlayer = function (world) {
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

Physics.prototype.buildGround = function () {
    var fixDef = new b2FixtureDef();
    fixDef.density = hx.constants.Ground.DENSITY;
    fixDef.friction = hx.constants.Ground.FRICTION;
    fixDef.restitution = hx.constants.Ground.RESTITUTION;
    fixDef.shape = new b2PolygonShape();

    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_staticBody;

    for (var b in hx.grounds.G2) {

    }
}

Physics.prototype.update = function () {
    this.world.Step(1 / 60, 10, 10);
    this.world.ClearForces();

}
