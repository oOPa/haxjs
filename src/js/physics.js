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
class Physics
{
    constructor(){
	var that  = this;
	this.world = new b2World(new b2Vec2(0, 0), true);
    }
    
    
update()
{
   
    //this.world.Step(1 / 60, 10, 10);
    this.world.Step(1 / 30, 10, 10);
    this.world.ClearForces();
    
}

clearForces()
{
    this.world.ClearForces();
}
}
class PhysicsPlayer {
    
    constructor (world,stadium) {
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
	this.keys = [false,false,false,false];

    var fixDef = new b2FixtureDef();
    //fixDef.density = hx.constants.Player.DENSITY;
    fixDef.friction = hx.constants.Player.FRICTION;
    fixDef.restitution = hx.constants.Player.RESTITUTION;
    //fixDef.shape = new b2CircleShape(hx.constants.Player.RADIUS);
    fixDef.shape = new b2CircleShape(30*hx.constants.Player.RADIUS);
    //bodyDef.position.x = 100 / hx.constants.World.SCALE;
    //bodyDef.position.y = 100 / hx.constants.World.SCALE;
	bodyDef.position.x = 30*hx.constants.Player.RADIUS;
    bodyDef.position.y = 30*hx.constants.Player.RADIUS;
	
	//bodyDef.position.x = 0;
	//bodyDef.position.y = 0;
    bodyDef.linearDamping = hx.constants.Player.LD;
    bodyDef.angularDamping = hx.constants.Player.AD;
	debugger;
    this.body = world.CreateBody(bodyDef);
    this.fix = this.body.CreateFixture(fixDef);
}
update ()
{
		var that = this;
		var vec = new PIXI.Vector(0, 0);
        //window.vec = new PIXI.Vector(0, 0);
        that.keys.forEach(function (key, i) {
        if (key) {
                var vec2 = new Utils.Vec(i * -90,200);
            vec.add(vec2.vec);
        }
        });
        
        if (vec.length() > 0)
        {
			console.log(this);
            that.body.ApplyForce(vec, that.body.GetWorldCenter());
            //console.log(that.player.point());
        }
        
}

}
class DefaultBall {
    constructor (world,stadium) {
    var that = this;
    this.point = function(){
            var v = that.body.GetPosition();
            return {x : v.x,y:v.y};
    }
        this.setPos = function(pos){
    this.body.SetPosition(new b2Vec2(pos.x,pos.y));
}
    
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
  
    var fixDef = new b2FixtureDef();
    fixDef.density = hx.constants.Ball.DENSITY;
    fixDef.friction = hx.constants.Player.FRICTION;
    fixDef.restitution = 0.1;
    fixDef.shape = new b2CircleShape(30*hx.constants.Ball.RADIUS);
    bodyDef.position.x = 100 / hx.constants.World.SCALE;
    bodyDef.position.y = 100 / hx.constants.World.SCALE;
    
    bodyDef.position.x = 50;
    bodyDef.position.y = 50;
    bodyDef.linearDamping =1// hx.constants.Player.LD;
    bodyDef.angularDamping = hx.constants.Player.AD;

    this.body = world.CreateBody(bodyDef);
    this.fix = this.body.CreateFixture(fixDef);
}

}
class BallFromStadium
{
    constructor(world,stadium)
    {
        var ballDefaults = stadium.getBall();
        var bodyDef = new b2BodyDef();
        bodyDef.type = b2Body.b2_dynamicBody;

        var fixDef = new b2FixtureDef();
        fixDef.density = ballDefaults.DENSITY;
        fixDef.friction = ballDefaults.FRICTION;
        fixDef.restitution = ballDefaults.RESTITUTION;
        fixDef.shape = new b2CircleShape(hx.constants.World.SCALE*ballDefaults.RADIUS);

        bodyDef.position.x = 50;
        bodyDef.position.y = 50;
        bodyDef.linearDamping = hx.constants.Player.LD;
        bodyDef.angularDamping = hx.constants.Player.AD;

        this.body = world.CreateBody(bodyDef);
        this.body.CreateFixture(fixDef);
    }
    setPos(pos)
    {
            this.body.SetPosition(new b2Vec2(pos.x,pos.y));
    }
    point(){
        var v = this.body.GetPosition();
        return {x : v.x,y:v.y};
    }
}
