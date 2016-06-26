var NetPlayer = function(name,avatar,world,peer_id) {
    var that = this;
    this.keys = [false,false,false,false];
    this.physics = new PhysicsPlayer(world);
    this.name = name;
    this.avatar = avatar;
    this.peer_id = peer_id;
};
NetPlayer.prototype.point = function(){
    var v = this.physics.body.GetPosition();
    return {x : v.x,y:v.y};   
}
NetPlayer.prototype.update = function(){
    var that = this;
    var vec = new PIXI.Vector(0, 0);
    window.vec = new PIXI.Vector(0, 0);
    that.keys.forEach(function (key, i) {
    if (key) {
        var vec2 = new Vec(i * -90,200);
        vec.add(vec2.vec);
    }});
    
    if (vec.length() > 0)
    {
        that.physics.body.ApplyForce(vec, that.physics.body.GetWorldCenter());
    }
}