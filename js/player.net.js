Loader.prototype.NetPlayer = function(name,avatar) {
        var that = this;
		this.name = name;
		//this.avatar = avatar.substr(0,2);
        this.avatar = avatar;
		this.x = 0;
		this.y = 0;
        this.point = function(){
            return {x : this.x,y:this.y};
        }
        this.update = new Function();
}
Loader.prototype.Ball = function(world)
{
	var that = this;
	this.body = new Physics.Ball(world);
}