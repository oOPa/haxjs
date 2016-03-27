Player = function(name,avatar,world) {
        var that = this;
		this.keys = [false,false,false,false]
        that.physics = new Physics.Player(world);
		this.name = name;
		//this.avatar = avatar.substr(0,2);
        this.avatar = avatar;
        this.point = function(){
            v = that.physics.body.GetPosition();
            return {x : v.x,y:v.y};
        }
        this.update = function () {
			//console.log("updateingf");
			        var vec = new PIXI.Vector(0, 0);
        window.vec = new PIXI.Vector(0, 0);
        that.keys.forEach(function (key, i) {
        if (key) {
                var vec2 = new Physics.Vec(i * -90,200);
            vec.add(vec2.vec);
        }
        });
        
        if (vec.length() > 0)
        {
            that.physics.body.ApplyForce(vec, that.physics.body.GetWorldCenter());
            //console.log(that.player.point());
        }
        return "updated";
		}
}
Loader.prototype.Ball = function(world)
{
	var that = this;
	this.body = new Physics.Ball(world);
}