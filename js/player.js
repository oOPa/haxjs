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
        this.updateDefault = function (){
        };
        this.update = function(){
            that.updateDefault();
        }
}
