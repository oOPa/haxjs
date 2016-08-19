class Renderer {

getState()
{
    return this.state;
}
getStateSync()
{
    return this.state;
}

createPlayer (name,avatar,index)
{
	var player = new NetPlayer(name,avatar,index);
    player.physics = new PhysicsPlayer(this.physics.world);
    var p = new RendererPlayer(name,avatar);
    this.camera.addChild(p.graphics);
    this.playersRendering[index] = p;    
    this.players[index] = player;    
	console.log("* "+name+" was moved to red");
	return player;
}
setStadium()
{
    
}
buildBall ()
{
	this.ballPhysics = new DefaultBall(this.physics.world);
    this.ballRender = new RendererBall(this.ballPhysics);
    this.camera.addChild(this.ballRender.graphics);
}

init  ()
{
    this.LobbyPlayerMovable = true;
    this.players = createArray(8);
    this.playersRendering = createArray(8);
    this.lobbyPlayers = createArray(8);
    
    this.physics = new Physics();
    /** balls */
    this.ballRender = 0;
    this.ballPhysics = 0;
    /** information for packet */
    this.state = [];
    this.sequenceNumber = 0;
    this.lastPriorities = createArray(8);
    this.inputs = createArray(8);
    this.priorities = createArray(8);
    this.indexOfPriorities = fillArray(8);
    //the number of states in the current packet
    this.stateCount = 0;
    //start drawing
    this.loadDraw();
}
loadDraw()
{
    /** initalise the renderer */
    this.renderer = PIXI.autoDetectRenderer(hx.rendering.resolution.width,hx.rendering.resolution.height, { antialias: hx.rendering.antialias});
    document.getElementById(hx.rendering.gameDivId).appendChild(this.renderer.view);
    this.renderer.backgroundColor = hx.rendering.backgroundColor;

    /** create variables and set up the stage */
    this.stage = new PIXI.Container();
    this.graphics = new PIXI.Graphics();
    this.viewport = new PIXI.Container();
    this.camera = new PIXI.Graphics();

    /** viewport */
    this.viewport.width = 20;
    this.viewport.height = 20;
    this.viewport.x=0;
    this.viewport.y=0;

    /** viewport border ***/
    this.camera.lineStyle(20,0x3c312b,1);
    this.camera.alpha = 1;
    this.camera.drawRect(0,0,800,(600-150));
    this.camera.endFill();

    /** display frame rate */
    this.fps =  new PIXI.Text('Menu (esc)',{font : '15px Arial', fill : 'white', align : 'center'});
    this.fps.x = 500;
    this.fps.y = 500;
    this.graphics.addChild(this.fps);

    //draw stadium
    this.drawStadiumFromIterator(window.classicStadiumIterator);
    //this.drawStadium();
    //draw post(s)
    //this.drawPosts();
    //draw nets
    //this.drawNets();
    //create a ball
    this.buildBall();
    //create lobby
    this.showLobby = false;
    //this.buildLobby();

    this.viewport.addChild(this.camera);
    this.graphics.addChild(this.viewport);
    //this.graphics.addChild(this.lobby);
    this.stage.addChild(this.graphics);
};
drawStadiumFromIterator(it)
{
    console.log("loading stadium \"" + it.getName()+"\"")

    this.stadium = new PIXI.Graphics();
    var size = it.getSize();
    this.stadium.width = it.width;
    this.stadium.height = it.height;

    var vit = it.getVertexes();
    var len = vit.length;
    var traits = it.getTraits();
    var scale = 50;

    //discs
    var dit = it.getDiscs();
    len = dit.length;
    for(var i = 0; i < len;i++)
    {
        var disc = dit[i];
          var radius = disc.radius || traits[disc.trait].radius;
        this.stadium.beginFill(parseInt(disc.color,16));
        this.stadium.drawCircle(disc.pos[0],disc.pos[1],radius);
        this.stadium.endFill();
    }
    //rnadom
     // this.stadium.lineStyle(2,0x000000);
  //  this.stadium.arcTo(50,0,50,50,2);
    //segments
    var sit = it.getSegments();
    len = sit.length;
    for(var i =0;i < len;i++)
    {
        var segment = sit[i];

            var v0 = vit[segment["v0"]];
            var v1 = vit[segment["v1"]];
           // console.log(v0);
            //check if visible
            if(true)
           // if(traits[segment.trait].vis)
            {
                if(!segment.curve)
                {
                    //no curve
                    this.stadium.lineStyle(2,0x000000);
                    
                    this.stadium.moveTo(v0.x,v0.y);
                    this.stadium.lineTo(v1.x,v1.y);
                }
                else
                {
                    //draw curve
                    var arc = (calculate_arc([v0.x,v0.y],[v1.x,v1.y],segment.curve));
  console.log(arc);
                    if(arc.radius)
                    {
                       this.stadium.lineStyle(5,0xFFFFFF);
                       this.stadium.arc(arc.center[0], arc.center[1], arc.radius, arc.from, arc.to, false);
                      
                      this.stadium.moveTo(0,0);//this.stadium.endFill();
                    }
                    else
                    {
    // this.stadium.moveTo(v0.x, v0.y);
     //           this.stadium.lineTo(v1.x, v1.y);
                    }
                }
}
        
    }
    //planes
    var pit = it.getPlanes();
    len = pit.length;
    for(var i =0;i < len;i++)
    {

    }

    this.camera.addChild(this.stadium);
}
moveToTeam1Lobby(lobbyPlayer)
{
    var that = this;
    if(lobbyPlayer.lobby)
    {
        lobbyPlayer.lobby.removePlayer(lobbyPlayer);
    }
    this.team1Lobby.addPlayer(lobbyPlayer);
    lobbyPlayer.setOnLeftDirectionClick(false);
    lobbyPlayer.setOnRightDirectionClick(function(){
        that.moveToSpecLobby();
    });
}
moveToSpecLobby()
{
    var that = this;
    if(lobbyPlayer.lobby)
    {
        lobbyPlayer.lobby.removePlayer(lobbyPlayer);
    }
    this.spectatorLobby.addPlayer(lobbyPlayer);
    lobbyPlayer.setOnRightDirectionClick(function(){
        that.moveToTeam2Lobby();
    });   
    lobbyPlayer.setOnRightDirectionClick(function(){
        that.moveToTeam1Lobby();
    });  
}
moveToTeam2Lobby()
{
    var that = this;
    if(lobbyPlayer.lobby)
    {
        lobbyPlayer.lobby.removePlayer(lobbyPlayer);
    }
    this.team2Lobby.addPlayer(lobbyPlayer);
    lobbyPlayer.setOnRightDirectionClick(false);
    lobbyPlayer.setOnLeftDirectionClick(function(){
        that.moveToSpecLobby();
    });
}
/** create the lobby */
buildLobby()
{
    this.lobby = new PIXI.Graphics();
    this.lobby.visible = false;
    this.lobby.beginFill(hx.rendering.backgroundColor);

    var margin = {x : 20,y:20};
    var rectProperties = {gap:50,width:250,height:200,text  :{font : '30px Arial', fill : 'white', align : 'center'}};
    /** team 1 */
    var team1 = new PIXI.Text('Team 1',rectProperties.text);
    team1.x = margin.x;
    team1.y = margin.y;
    this.lobby.drawRect(margin.x,margin.y,rectProperties.width,rectProperties.height);
   
    /** spectator */
    var spectator = new PIXI.Text('Spectators',rectProperties.text);
    var x =  margin.x + rectProperties.width + rectProperties.gap
    spectator.x = x;
    spectator.y = margin.y;
    this.lobby.drawRect(x, margin.y,rectProperties.width,rectProperties.height);

    /** team 2 */
    var team2 = new PIXI.Text('Team 2',rectProperties.text);
    x +=  rectProperties.width + rectProperties.gap;
    team2.x = x;
    team2.y = margin.y;
    this.lobby.drawRect(x,margin.y,rectProperties.width,rectProperties.height);
    
    /** start button */
    var startButton = new PIXI.Text('Start',rectProperties.text);
    startButton.x = 200;
    startButton.y = 825;
    this.lobby.drawRect(200,800,200,200);

    /** lobby players */
    this.team1Lobby = new LobbyPlayerManager(margin.x,margin.y+20);
    this.team2Lobby = new LobbyPlayerManager(x,margin.y);
    this.spectatorLobby = new LobbyPlayerManager(spectator.x,spectator.y);

    //sample lobby player
    this.sampleLobbyPlayer = new LobbyPlayerObject();
    this.sampleLobbyPlayer2 = new LobbyPlayerObject();
    this.lobby.addChild(this.sampleLobbyPlayer.graphics);
    this.lobby.addChild(this.sampleLobbyPlayer2.graphics);
    this.team1Lobby.addPlayer(this.sampleLobbyPlayer);
    this.team2Lobby.addPlayer(this.sampleLobbyPlayer2);

    /** add to lobby */
    this.lobby.addChild(team1);
    this.lobby.addChild(spectator);
    this.lobby.addChild(team2);
    this.lobby.addChild(startButton);
}
createLobbyPlayer(player)
{

}
toggleLobby()
{
    return false;
    if(this.showLobby)
    {
        this.viewport.visible = false;
        this.lobby.visible = true;
        this.renderer.backgroundColor = 0x3c312b;
    }
    else
    {
        this.viewport.visible = true;
        this.lobby.visible = false;
        this.renderer.backgroundColor = hx.rendering.backgroundColor;
    }
    this.showLobby = !this.showLobby;
}
/** draw the nets goals and everying in between **/
drawNets ()
{
    this.camera.lineStyle(2,0x000000);
    this.camera.beginFill(0x0000FF, 1);
    this.camera.arc(90-10,177+20,25,Math.PI,(3/2)*Math.PI)
    this.camera.endFill();
    /** second arc **/
    this.camera.arc(90-10,177+173,25,Math.PI/2,(2/2)*Math.PI)
}
drawMisc ()
{
    this.misc = new PIXI.Graphics();
    this.misc.beginFill(0x3c312b);
    misc_pos = { x : 700, y:500};
    this.misc.drawRect(misc_pos.x,misc_pos.y,100,200);
    this.misc.endFill();
    /* menu buttons */
    this.misc.beginFill(0x604E44);
    this.misc.drawRect(misc_pos.x, 500, 75, 30);
    this.misc.drawRect(misc_pos.x, 550, 75,30);
    var menuTxt =  new PIXI.Text('Menu (esc)',{font : '15px Arial', fill : 'white', align : 'center'});
    var optTxt =  new PIXI.Text('Options',{font : '15px Arial', fill : 'white', align : 'center'});

    /** set position of buttons */
    menuTxt.x = misc_pos.x;
    menuTxt.y = 500;

    optTxt.x = misc_pos.x;;
    optTxt.y = 550;
    //604E44
    this.misc.addChild(menuTxt);
    this.misc.addChild(optTxt);
    this.misc.endFill();
    this.graphics.addChild(misc);
}
drawChat ()
{
    this.chat = new PIXI.Graphics();
    this.chat.beginFill(0x3c312b);
    this.chat.drawRect(0,500,400,200);
    this.chat.endFill();
    this.chat.x = 0;

    /** chat log **/
    var log = this.log = new PIXI.Text("");
    log.style = hx.style;
    log.y = 510;
    log.x += 10;

    this.chat.addChild(log);
    that.graphics.addChild(this.chat);
}
drawPosts ()
{
    this.camera.lineStyle(2,0x000000);
    this.camera.beginFill(0xFFCCCC, 1);
    this.camera.drawCircle(90, 370,10);
    this.camera.endFill();
    this.camera.lineStyle(2,0x000000);
    this.camera.beginFill(0xFFCCCC, 1);
    this.camera.drawCircle(90, 170,10);
    this.camera.endFill();
}
drawStadium ()
{
    this.camera.lineStyle(3,0xFFFFFF,0.5);
    this.camera.alpha = 1;
    this.camera.drawRect(90,20,800-60,(600-200));
    this.camera.endFill();
}
/** start rendering **/
setFps()
{
    var that = this;
    var fps =that.frameTime;
    that.fps.text = fps;
}
startRender ()
{
    var that = this;
    animate();
    //display the fps
    setInterval(this.setFps.bind(this),500);
    
    var prevTime = 0;

    function animate(currentTime) {
        that.renderer.render(that.stage);
        that.frameTime = 1000 / (currentTime - prevTime);
        that.drawObjects(currentTime);
        that.moveCamera();
        prevTime = currentTime;       
        requestAnimationFrame( animate ); 
                   
     
    }
};
moveCamera()
{
    if(this.playersRendering[0])
    {
        //console.log(this.playersRendering[0].graphics);
        var point = this.playersRendering[0].graphics.position;
        this.viewport.pivot.x = point.x - 250;
        this.viewport.pivot.y= point.y - 250;
    }
}
drawObjects(currentTime)
{
    //calculate physics
    this.doPhysics();
    //reset packet and add header
    this.temp = [++this.sequenceNumber]; 
    this.stateCount = 0;
    //calculate priorities
    this.getPriories();
    this.sortPriorities();
    /** render players/balls and make packet*/
    this.drawBall();
    this.drawPlayers(currentTime);
    //reset priorities and update packet
    this.state = this.temp;
    this.lastPriorities = this.priorities;
}
sortPriorities()
{
    var that = this;
    this.indexOfPriorities.sort(function (a,b){
        return that.priorities[b] - that.priorities[a];
    });
}
getPriories()
{
    for(var i in this.players)
    {
        var player = this.players[i];
        if(player !== 0)
        {
            this.priorities[i] = player.getPriority();
        }
    }
}

doPhysics()
{
	for(i in this.players)
	{
		var item = this.players[i];
        if(item !== 0)
        {
	        item.update();
        }
	}
	this.physics.update();
    this.clearForces();  
}
clearForces()
{
    this.physics.clearForces();
}
getLastPriority(index)
{
    return this.lastPriorities[index];
}
setPriority(index, priority)
{
    this.priorities[index] = priority;
}
drawPlayers (currentTime)
{
    for(i in this.indexOfPriorities)
    {
        var item = this.playersRendering[i];
        //player has a graphics object that exitsts
        if(item !== 0 )
        {
            //graphics and physics information
            var point = this.players[i].point(currentTime);
            var p = item.graphics.position;

            //check if item has priority
            if(this.getLastPriority(i) > 0)
            {
                //check if fits into the packet
                if(this.stateCount < hx.MaxStateUpdatesPerPacket)
                {
                    //add index to packet
                    this.temp.push(i);
                    //add physics data
                    this.temp.push(point);
                    //add inputs
                    this.temp.push(this.players[i].keys);
                    //set the priority to zero
                    //this.setPriority(item,0);
                }
            }
            item.setAction(this.players[i].action);
            p.x = point.x;
            p.y = point.y;
        }
    }
}
drawBall ()
{
    if(this.ballRender !== 0)
    {
        var pos = this.ballRender.graphics.position;
        var point = this.ballPhysics.point();
        
        this.temp.push(point);
        
        pos.x = point.x;
        pos.y = point.y;    
    }  
}

}
class RendererBall {
     constructor (ball) {
    var that = this;
    this.graphics = new PIXI.Graphics();
    that.graphics.beginFill(0xFFFFFF);
    that.graphics.lineStyle(1.5,0x000000);
    that.graphics.beginFill(0xFFFFFF, 1);
    that.graphics.drawCircle(0,0,30*hx.constants.Ball.RADIUS);
    that.graphics.endFill();
}}
class RendererPlayer {
    setAction(isAction)
    {
        if(isAction)
        {
    
		this.graphics.lineStyle(3.5,0xFFFFFF);
        }
        else
        {
			this.graphics.lineStyle(3,0xFFFFFF);
        }
    }
     constructor (name,avatar) {
     var that = this;
		this.graphics = new PIXI.Graphics();
        that.graphics.position = new PIXI.Vector(0,0);
		that.graphics.lineStyle(3,0xFFFFFF);
		that.graphics.beginFill(0xE56E56, 1);
		//that.graphics.drawCircle(hx.constants.Player.RADIUS, 50,hx.constants.Player.RADIUS * hx.constants.World.SCALE);
        that.graphics.drawCircle(0,0,30 * hx.constants.Player.RADIUS )//* hx.constants.World.SCALE);
		that.graphics.endFill();
		that.name_label = new PIXI.Text(name,{font : '25px Arial', fill : 'white', align : 'center'});
		//that.avatar_label = new PIXI.Text("",{font : '25px Arial', fill : 'white', align : 'center'});
		//that.avatar_label.x = Loader.constants.RADIUS-7.50;
		//that.avatar_label.y = (50)-15;
		that.name_label.y = 30 * hx.constants.Player.RADIUS;
        //this.setAvatar(player.avatar);
		//that.graphics.addChild(that.avatar_label);
		that.graphics.addChild(that.name_label);
    
    }
    updateAvatar(avatar)
    {
        this.avatar_label.txt = avatar;
    }
    
}
class LobbyPlayerObject
{
   
  
    setPos(x,y)
    {
        this.graphics.x = x;
        this.graphics.y = y;
    }
     constructor()
    {
        var width = 200;
        this.height = 30;
        this.hitButtonWidth = 5;
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xFFFFFF,0.5);
        this.graphics.drawRoundedRect(0,0,width,this.height,15);
        this.graphics.endFill();

        var countryText = new PIXI.Text("UK",{font : '10px Arial', fill : 'black'});
        countryText.x = 20;
        countryText.y = 5;      
        var nicknameText = new PIXI.Text("Benjamin",{font : '20px Arial', fill : 'black'});
        nicknameText.x = 40;
        nicknameText.y  =2.5;
        this.pingText = new PIXI.Text("ping: 12",{font : '15px Arial', fill : 'green'});
        this.pingText.x = 140;
        this.pingText.y = 5;
        
        //buttons
        this.createButtons();
        this.graphics.addChild(countryText);
        this.graphics.addChild(nicknameText);
        this.graphics.addChild(this.pingText);
    }
    getIndex()
    {
        return this.index;
    }
    update()
    {
        this.ping = player.getPing();
    }
    setLobby(lobby)
    {
        this.lobby = lobby;
    }
    setOnLeftDirectionClick(action)
    {
        if(action)
        {
            this.leftButton.interative = true;
                        this.rightButton.buttonMode =true;

            this.rightButton.hitArea = new PIXI.RoundedRectangle(0,0,20,30,5);
            this.leftButton.click = action;
            
        }
        else
        {
            this.leftButton.interative = false;
            this.rightButton.buttonMode =false;
        }
    }
    setOnRightDirectionClick(action)
    {
        if(action)
        {
            this.rightButton.interative = true;
            this.rightButton.buttonMode =true;
            this.rightButton.hitArea = new PIXI.RoundedRectangle(10,0,20,30,5);
            this.rightButton.click = action;  
        }
        else
        {
            this.rightButton.interative = false;
                        this.rightButton.buttonMode =false;
        }  
    }
    createButtons()
    {
        var that = this;
        /** left */
        this.leftButton = new PIXI.Graphics();
        this.leftButton.beginFill(0x000000);
        this.leftButton.drawRoundedRect(0,0,20,30,5);
        var leftButtonTxt = new PIXI.Text("<",{font : '20px Arial', fill : 'white'});
        this.leftButton.x = 0;

        //this.leftButton.setInteractive(true);
        /** right */
        this.rightButton = new PIXI.Graphics();
        this.rightButton.beginFill(0x000000);
        this.rightButton.drawRoundedRect(10,0,20,30,5);
        var rightButtonTxt = new PIXI.Text(">",{font : '20px Arial', fill : 'white'});
        rightButtonTxt.x =20;
        rightButtonTxt.y = 0;
        this.rightButton.x = 180    ;
        //this.rightButton.setInteractive(true);
        /** add */

        this.leftButton.addChild(leftButtonTxt);
        this.graphics.addChild(this.leftButton);
        
        this.rightButton.addChild(rightButtonTxt);
        this.graphics.addChild(this.rightButton);
    }

}
class LobbyPlayerManager
{
    constructor(x,y)
    {
        this.players = createArray(8);
        this.len = 0;
        this.x = x;
        this.y = y;
    }
    addPlayer(lobbyPlayer)
    {
        if(!this.players[lobbyPlayer.getIndex()])
        {
            this.len += 1;
            lobbyPlayer.setPos(this.x,this.y+35*this.len);
            lobbyPlayer.setLobby(this);
            return true;
        }
        return false;
    }
    removePlayer(lobbyPlayer)
    {
        if(this.players[lobbyPlayer.getIndex()])
        {
            this.players[lobbyPlayer.getIndex()] = 0; 
            lobbyPlayer.setLobby(0); 
            this.len -= 1;  
        }
    }

}