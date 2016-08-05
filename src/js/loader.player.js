var NetPlayer = function(name,avatar,index) {
    var that = this;
    this.keys = [false,false,false,false];
    this.name = name;
    this.avatar = avatar;
    this.ping = 0;
    this.index = index;
    this.latency = 0;
    this.moving = false;
    //this.old = {vx:0,vy:0,time:getTimeMs()};
    this.priority = 1000;
};
NetPlayer.prototype.stop = function()
{
    this.physics.body.SetLinearVelocity(new b2Vec2(0,0));
}
NetPlayer.prototype.getPriority = function(){
    return this.priority;
}
NetPlayer.prototype.point = function(t){
    var v = this.physics.body.GetPosition();
    //var velocity = this.physics.body.GetLinearVelocity();
    //var dt = t - this.old.time;
    //var p = {x : v.x,y:v.y,vx:velocity.x,vy:velocity.y,ax:(velocity.x - this.old.vx)/dt,ay:(velocity.y - this.old.vy)/dt};
    //this.old = {vx:velocity.x,vy:velocity.y,time: t || getTimeMs()};
    var p = {x:v.x,y:v.y};
    return p;   
}
NetPlayer.prototype.getIndex = function()
{
    return this.index;
}
NetPlayer.prototype.getLatency = function()
{
    return this.ping;
}

NetPlayer.prototype.getName = function () {
    return this.name;
}

NetPlayer.prototype.setPos = function(pos)
{
    this.physics.body.SetPosition(new b2Vec2(pos.x,pos.y));
}
NetPlayer.prototype.setPosAndVelocity = function(pos)
{
    this.physics.body.SetPosition(new b2Vec2(pos.x,pos.y));
    this.physics.body.SetLinearVelocity(new b2Vec2(pos.vx,pos.vy));
}
NetPlayer.prototype.update = function(){
    var that = this;
    var vec = new PIXI.Vector(0, 0);
    that.keys.forEach(function (key, i) {
    if (key) {
        var vec2 = new Vec(i * -90,200);
        vec.add(vec2.vec);
    }});
    this.vec = vec;
    if (vec.length() > 0)
    {
        that.physics.body.ApplyForce(vec, that.physics.body.GetWorldCenter());
    }
    return this.keys;
}
NetPlayer.prototype.getVector = function()
{
    return this.vec;
}