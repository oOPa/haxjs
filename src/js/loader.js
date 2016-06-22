class Haxball{
	
	constructor(){
		this.players = [];
		this.logger = new Logger();
		this.physics = new Physics();
	}
	
    render ()
	{
		for(i in this.players)
		{
                let item = this.players[i];
                item.update();
		}
			this.physics.update();
	}
	createRenderer ()
	{
		return (this.renderer = new Renderer(this.render));
	}
	createPlayer ()
	{
    	var player = new HostPlayer(name,avatar,this.physics.world);
		this.players.push(player);
		
		if(typeof this.renderer != 'undefined')
		{
			this.renderer.addPlayer(player);
		}
		
		this.addText("* "+player.name+" was moved to red");
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



