var Haxball = function(){
	
	
		this.players = [];
		this.logger = new Logger();
		this.physics = new Physics();
	}
	
Haxball.prototype.render = function ()
	{
		/** change this */
		var that = haxball;
		for(i in that.players)
		{
                let item = that.players[i];
				//console.log(item);
                item.update();
		}
			//console.log(this);
			that.physics.update();
	}
Haxball.prototype.createRenderer = function ()
	{
		return (this.renderer = new Renderer(this.render));
	}
Haxball.prototype.createPlayer = function(name,avatar)
	{
		var that = haxball;
    	var player = new HostPlayer(name,avatar,that.physics.world);
		this.players.push(player);
		
		if(typeof that.renderer != 'undefined')
		{
			this.renderer.addPlayer(player);
		}
		
		this.addText("* "+player.name+" was moved to red");
    	console.log(" creating new player player here")
		return player;
		
	}
Haxball.prototype.buildBall =function ()
	{
    	var ball = new DefaultBall(this.physics.world);
    	this.renderer.addBall(ball);
	}
Haxball.prototype.addText = function (txt)
	{
		this.logger.addChat(txt);
	}


