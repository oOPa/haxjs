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
	this.buildGround();
    this.addCollisionDetection();
}
Physics.prototype.addCollisionDetection = function()
{
    
    b2ContactListener.BeginContact = function(contact) {
        //console.log(contact.GetFixtureA().GetBody().GetUserData());
        console.log("start contact\n/**");
        console.log(contact.GetFixtureA);
        console.log(contact.GetFixtureB)
        console.log("*/")
    }
    b2ContactListener.EndContact = function(contact) {
        //console.log(contact.GetFixtureA().GetBody().GetUserData());
        console.log("end contact");
    }
    b2ContactListener.PostSolve = function(contact, impulse) {
        //console.log(contact.GetFixtureA().GetBody().GetUserData());
        console.log("post solve");
    }
    b2ContactListener.PreSolve = function(contact, oldManifold) {
        console.log("pre solve");
    }
   this.world.SetContactListener(b2ContactListener);
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
