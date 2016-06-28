var NetPlayer = function(name,avatar) {
    var that = this;
    this.keys = [false,false,false,false];
    this.name = name;
    this.avatar = avatar;
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