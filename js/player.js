Loader.prototype.Player = function(name,avatar,world) {
        var that = this;
        that.physics = new Physics.Player(world);
		this.name = name;
		//this.avatar = avatar.substr(0,2);
        this.avatar = avatar;
        this.point = function(){
            v = that.physics.body.GetPosition();
            return {x : v.x,y:v.y};
        }
        this.update = new Function();
}
Loader.prototype.Ball = function(world)
{
	var that = this;
	this.body = new Physics.Ball(world);
}