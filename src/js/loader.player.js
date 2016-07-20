var NetPlayer = function(name,avatar) {
    var that = this;
    this.keys = [false,false,false,false];
    this.name = name;
    this.avatar = avatar;
    //this.lastSendTime = 0;
    //this.lastReceiveTime = 0;
    this.ping = 0;
    this.latency = 0;
    this.positions = [];
    this._previous = {x:0,y:0};
};

NetPlayer.prototype.point = function(){
    var time = new Date().getTime();
    var v = this.physics.body.GetPosition();
    var p = {x : v.x,y:v.y,time:time};
    this._previous = p ;
    return p;   
}
NetPlayer.prototype.previous =  function () {
    return this._previous;
}

NetPlayer.prototype.getName = function () {
    return this.name;
}
NetPlayer.prototype.setState = function()
{
    
}
NetPlayer.prototype.getTotalPos = function () {
    var total = {};
    var time = new Date().getTime();
    var p = this.physics.body.GetPosition();
    var l = this.physics.body.GetLinearVelocity();
    total.x = p.x;
    total.y = p.y;
    total.vx = l.x;
    total.vy = l.y;
    total.vxvy = (l.x == l.y) && (l.y == 0);
    total.time = time;
    return total;
}
NetPlayer.prototype.getTotalPosSlower = function () {
    var total = {};
    var time = new Date().getTime();
    var p = this.physics.body.GetPosition();
    var l = this.physics.body.GetLinearVelocity();
    
    /** accleration */
    var t2 = new Date().getTime();
    var l2 =  this.physics.body.GetLinearVelocity();
    var dt = t2 - time;
    total.ax = (l2.x - l.x) / dt
    total.ay = (l2.y - l.y) / dt
    total.t2 = t2;
    
    total.x = p.x;
    total.y = p.y;
    total.vx = l.x;
    total.vy = l.y;
    total.vxvy = (l.x == l.y) && (l.y == 0);
    total.time = time;
    return total;
}
NetPlayer.prototype.setTotalPos = function(pos)
{
    this.physics.body.SetLinearVelocity(new b2Vec2(pos.vx,pos.vy));
}
NetPlayer.prototype.setPos = function(pos)
{
    this.physics.body.SetPosition(new b2Vec2(pos.x,pos.y));
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
}
NetPlayer.prototype.getVector = function()
{
    return this.vec;
}