var Logger = require("./loader.logger.js").Logger;
var Physics = require("./loader.physics.js").Physics;

export class Haxball{
	
	constructor(){
		this.players = [];
		this.logger = new Logger();
		this.physics = new Physics();
	}
	
    render ()
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
	createRenderer ()
	{
		return (this.renderer = new Renderer(this.render));
	}
	createPlayer ()
	{
		var that = haxball;
    	let player = new HostPlayer(name,avatar,that.physics.world);
		this.players.push(player);
		
		if(typeof that.renderer != 'undefined')
		{
			this.renderer.addPlayer(player);
		}
		
		this.addText("* "+player.name+" was moved to red");
    	console.log(" creating new player player here")
		return player;
		
	}
	buildBall ()
	{
    	var ball = new DefaultBall(this.physics.world);
    	this.renderer.addBall(ball);
	}
	addText(txt)
	{
		this.logger.addChat(txt);
	}
};

