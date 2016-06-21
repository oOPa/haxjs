class Haxball{
	constructor(){
    this.players =  [];
	this.logger = new HaxballLogger();
	this.physics = new HaxballPhysics();
	}
    render () {   
            for(i in this.players)
            {
                item = this.players[i];
                item.update();
            }
			this.physics.update();
        }
	createRenderer(){
			return (this.renderer = new HaxballRenderer(this.render));
	}
	createPlayer(){
    var player = new Loader.Host.Player(name,avatar,this.physics.world);
	this.players.push(player);
	if(typeof this.renderer != 'undefined')
	{
		this.renderer.addPlayer(player);
	}
	this.addText("* "+player.name+" was moved to red");
    return player;
	}
	buildBall(){
    	var ball = new Loader.Physics.DefaultBall(this.physics.world);
    	this.renderer.addBall(ball);
	}
	addText(txt){
			this.logger.addChat(txt);
}
	};
	
Loader.Host =  {};
Loader.Client = {};



