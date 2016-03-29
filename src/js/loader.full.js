var Loader = function () {
	var that = this;
    that.players =  [];
	that.physics = new Loader.Physics();
        Loader.prototype.render = function () {   
            for(i in that.players)
            {
                item = that.players[i];
                item.update();
            }

			that.physics.update();
        }
	}
Loader.Host =  {};
Loader.Client = {};
Loader.prototype.createRenderer = function()
{
	return (this.renderer = new Loader.Renderer(this.render));
}
Loader.prototype.createPlayer = function(name, avatar){
	var that = this;
    var player = new Loader.Host.Player(name,avatar,that.physics.world);
	that.players.push(player);
	if(typeof this.renderer != 'undefined')
	{
		that.renderer.addPlayer(player);
	}
	that.addText("* "+player.name+" was moved to red");
    return player;
}
Loader.prototype.addText = function(txt) {
    if(this.renderer){
        this.renderer.addText(txt)
    }
    else{
        return false;
    }
}
Loader.Host.Controller = function(player){
        var that = this;
        this.player = player;

   document.addEventListener('keydown', function (e) {
        if (e.keyCode > 36 && e.keyCode < 41) {
            that.player.keys[hx.constants.Directions[e.keyCode]] = true;		
			console.log(e.keyCode);            
        }
    });
    document.addEventListener('keyup', function (e) {
            that.player.keys[hx.constants.Directions[e.keyCode]] = false;			
			console.log(e.keyCode);

    });

}Loader.Client.Controller = function(player){
        var that = this;
        that.keys = [false,false,false,false];
        that.Directions = hx.constants.Directions;
		document.addEventListener('keydown', function (e) {
        if (e.keyCode > 36 && e.keyCode < 41) {
            that.keys[that.Directions[e.keyCode]] = true;		
			console.log(e.keyCode);            
        }
		});
		document.addEventListener('keyup', function (e) {
            that.keys[that.Directions[e.keyCode]] = false;			
			console.log(e.keyCode);          
    });
}Loader.Net = function()
{
	this.max = 8;
	this.isHost = false;
	this.clients = new Hashtable();
}
Loader.Net.prototype.getRooms = function()
{
	return this.roomlist;
}
Loader.Net.prototype.stopUpdates = function ()
{
	if(typeof this.timer != 'undefined')
	{
		clearInterval(this.timer)
	}
}
Loader.Net.prototype.startUpdates = function ()
{
	if(typeof this.timer == 'undefined')
	{
		this.timer = this.isHost ? setInterval(this.updateClients,hx.intervals) : setInterval(this.sendUpdatesToHost,hx.intervals);
	}
}
Loader.Net.prototype.updateClients = function ()
{
	n = ['host']
	n.push(game.players[0].point())
	if(game.first && game.first.open)
	{
		game.first.send(n);
	}

	keys = game.net.clients.keys();
	for(i in keys)
	{
		item = keys[i]
		n = [item]
		n.push(game.net.clients.get(item).point());
		
		for (x in game.net.peer.connections){
			//host	
			con = game.net.peer.connections[x][0];
			con.send(n);
		}
	}
	
	//console.log(n);
}
Loader.Net.prototype.sendUpdatesToHost = function ()
{
	window.host.send(game.controller.keys);
}
Loader.Net.prototype.updateFromHost = function (updates)
{
	//console.log("sending updates");
	//data = {name : 'host'}	
	game.renderer.prototype.players.get(updates[0]).point = updates[1];
}
Loader.Net.prototype.joinRoom = function(peer_id,callback)
{
		/*
	*on_error
	*on_host_connect
	*on_host_dc
	*on_host_data
	*/
	var that = this;
	this.host = peer_id;
	this.peer = new Peer({host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	
	this.peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		that.connection = this.connect(that.host);
		that.connection.on('open', function () {
			console.log("connected to host!");
			window.host = that.connection;
			//if typeof(callback) === "function") {
			callbacks.on_host_connect();
		});
		
		that.connection.on('data',function(dataConnection){
			//callbacks.on_host_data(dataConnection);
			//console.log(dataConnection);
			that.updateFromHost(dataConnection);
		});
		that.connection.on('error',function(err){
			console.log(err)
		})
	}); 
	return this;
}
Loader.Net.prototype.receiveClientData = function(con,data)
{
	this.clients.get(con.peer).keys = data;
}
Loader.Net.prototype.sendMessage = function()
{
	if(this.isHost)
	{
		
	}
	else
	{
		
	}
}
Loader.Net.prototype.createRoom = function(callbacks)
{
	/*
	*on_peer_init
	*on_error
	*on_peer_connect
	*on_peer_dc
	*on_peer_data
	*/
	var that = this;
	this.isHost = true;
	this.peer = new Peer({host : hx.server.host,path:"/api",port:hx.server.port,key:hx.server.key});
	
	this.peer.on('open', function(id) {
		console.log('My peer ID is: ' + id);
		console.log('waiting for connections');
		callbacks.on_peer_init();
		that.peer.on('connection', function(dataConnection) { 
			console.log("new peer "+dataConnection.peer+" connected");
			callbacks.on_peer_connect(dataConnection.peer);
			game.first = dataConnection;
			dataConnection.on('close',function () {
				game.net.clients.remove(dataConnection.peer);
				callbacks.on_peer_dc(dataConnection);
			});
			
			dataConnection.on('data',function(data){
				//callbacks.on_peer_data(data);
				that.receiveClientData(dataConnection,data);
			});
		});

	}); 
	this.peer.on('error',function(err){
		callbacks.on_error(err);
	});
	
};

var b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2Fixture = Box2D.Dynamics.b2Fixture,
    b2World = Box2D.Dynamics.b2World,
    b2MassData = Box2D.Collision.Shapes.b2MassData,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape,
    b2ContactListener = Box2D.Dynamics.b2ContactListener,
    b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
/**
 * b2contactlistener
 */
//var b2ContactListener = Box2d.Dynamics.b2ContactListener;
Loader.Physics = function()
{
	var that  = this;
	this.world = new b2World(new b2Vec2(0, 0), true);
}

Loader.Physics.Player = function (world) {
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;
	this.keys = [false,false,false,false];

    var fixDef = new b2FixtureDef();
    //fixDef.density = hx.constants.Player.DENSITY;
    fixDef.friction = hx.constants.Player.FRICTION;
    fixDef.restitution = hx.constants.Player.RESTITUTION;
    //fixDef.shape = new b2CircleShape(hx.constants.Player.RADIUS);
    fixDef.shape = new b2CircleShape(30*hx.constants.Player.RADIUS);
    bodyDef.position.x = 100 / hx.constants.World.SCALE;
    bodyDef.position.y = 100 / hx.constants.World.SCALE;
	
	//bodyDef.position.x = 0;
	//bodyDef.position.y = 0;
    bodyDef.linearDamping = hx.constants.Player.LD;
    bodyDef.angularDamping = hx.constants.Player.AD;

    this.body = world.CreateBody(bodyDef);
    this.body.CreateFixture(fixDef);
};
Loader.Physics.Player.prototype.update = function()
{
		var that = this;
		var vec = new PIXI.Vector(0, 0);
        window.vec = new PIXI.Vector(0, 0);
        that.keys.forEach(function (key, i) {
        if (key) {
                var vec2 = new Loader.Physics.Vec(i * -90,200);
            vec.add(vec2.vec);
        }
        });
        
        if (vec.length() > 0)
        {
			console.log(this);
            that.body.ApplyForce(vec, that.body.GetWorldCenter());
            //console.log(that.player.point());
        }
        
}
Loader.Physics.prototype.update = function () {
    this.world.Step(1 / 60, 10, 10);
       //this.world.Step(1 / 30, 10, 10);
    this.world.ClearForces();
    
}
Loader.Physics.deg2rad = function (deg) {
    return deg * Math.PI / 180;
};
Loader.Physics.Vec = function (deg, mag) {
    var deg = Loader.Physics.deg2rad(deg);
    this.vec = new PIXI.Vector(Math.cos(deg) * mag, Math.sin(deg) * mag);
};
Loader.Physics.Ball = function (world) {
    var bodyDef = new b2BodyDef();
    bodyDef.type = b2Body.b2_dynamicBody;

    var fixDef = new b2FixtureDef();
    fixDef.density = hx.constants.Ball.DENSITY;
    fixDef.friction = hx.constants.Ball.FRICTION;
    fixDef.restitution = hx.constants.Ball.RESTITUTION;
    fixDef.shape = new b2CircleShape(hx.constants.Ball.RADIUS);

	bodyDef.position.x = 100 / hx.constants.World.SCALE;
	bodyDef.position.y = 100 / hx.constants.World.SCALE;

    bodyDef.linearDamping = hx.constants.Ball.LD;
    bodyDef.angularDamping = hx.constants.Ball.AD;

    this.body = world.CreateBody(bodyDef);
    this.body.CreateFixture(fixDef);
}Loader.Host.Player = function(name,avatar,world) {
        var that = this;
		this.keys = [false,false,false,false]
        this.physics = new Loader.Physics.Player(world);
		this.name = name;
		//this.avatar = avatar.substr(0,2);
        this.avatar = avatar;
        this.point = function () {
            v = that.physics.body.GetPosition();
            return {x : v.x,y:v.y};
        }
        this.update = function () {

			        var vec = new PIXI.Vector(0, 0);
        window.vec = new PIXI.Vector(0, 0);
        that.keys.forEach(function (key, i) {
        if (key) {
                var vec2 = new Loader.Physics.Vec(i * -90,200);
            vec.add(vec2.vec);
        }
        });
        
        if (vec.length() > 0)
        {
            that.physics.body.ApplyForce(vec, that.physics.body.GetWorldCenter());

        }
        return "updated";
		}
}
Loader.Client.Player = function(name,avatar) {
        var that = this;
		this.name = name;
		//this.avatar = avatar.substr(0,2);
        this.avatar = avatar;
		this.x = 0;
		this.y = 0;
        this.point = function () {
            return {x : this.x,y:this.y};
        }
        this.update = new Function();
}
Loader.Renderer = function(renderFunction){
	var that = this;
    this.players = new Hashtable();
    this.init();
    this.renderFunction = renderFunction || new Function();
};
Loader.Renderer.prototype.init = function () {
var that = this;
//var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true });
var renderer = PIXI.autoDetectRenderer(800, 600, { antialias: true});
this.renderer = renderer;
document.getElementById("game-view").appendChild(renderer.view)
//renderer.backgroundColor = 0x718c5a;
renderer.backgroundColor = 0x939e7f;

// create the root of the scene graph
/**
	stage
		graphics
			viewport_
				camera
					players
			chat
				log
				txt
				
			misc
				menuTxt
				optTxt
**/
var stage = new PIXI.Container();
that.stage = stage;
var graphics = new PIXI.Graphics();
this.graphics = graphics;
var viewport_ = new PIXI.Container();
that.camera = new PIXI.Graphics();
viewport_.width = 20;
viewport_.height = 20;
viewport_.x=0;
viewport_.y=0
/** viewport border ***/
//graphics.beginFill(0x3c312b);
graphics.lineStyle(20,0x3c312b,1);
graphics.alpha = 1;
graphics.drawRect(0,0,800,(600-150));
graphics.endFill();



/** add ball(s) **/
that.camera.beginFill(0xFFFFFF);
// draw a circle, set the lineStyle to zero so the circle doesn't have an outline
that.camera.lineStyle(1.5,0x000000);
that.camera.beginFill(0xFFFFFF, 1);
//that.camera.drawCircle(500, 250,hx.constants.Ball.RADIUS);
that.camera.endFill();

/** draw stadium **/
that.camera.lineStyle(3,0xFFFFFF,0.5);
that.camera.alpha = 1;

that.camera.drawRect(90,20,800-60,(600-200));
that.camera.endFill();

//draw post(s)
that.camera.lineStyle(2,0x000000);
that.camera.beginFill(0xFFCCCC, 1);
that.camera.drawCircle(90, 370,10);
that.camera.endFill();

that.camera.lineStyle(2,0x000000);
that.camera.beginFill(0xFFCCCC, 1);
that.camera.drawCircle(90, 170,10);
that.camera.endFill();

//draw nets
that.camera.lineStyle(2,0x000000);
that.camera.beginFill(0x0000FF, 1);
that.camera.arc(90-10,177+20,25,Math.PI,(3/2)*Math.PI)
that.camera.endFill();

/** second arc **/
that.camera.lineStyle(2,0x000000);
that.camera.beginFill(0x0000FF, 1);
that.camera.arc(90-10,177+173,25,Math.PI/2,(2/2)*Math.PI)
that.camera.endFill();

//goal back net
that.camera.lineStyle(2,0x000000);
that.camera.moveTo(55,197);
that.camera.lineTo(55,350);
that.camera.endFill();


/** chat and misc **/
/** add chat area **/
var chat = new PIXI.Graphics();
//var chatContent = new PIXI.DisplayObjectContainer();
chat.beginFill(0x3c312b);
chat.drawRect(0,500,400,200);
chat.endFill();
chat.x = 0;

/** chat log **/
var log = this.log = new PIXI.Text("");
log.style = hx.style;
log.y = 510;
log.x += 10;
/** user input **/
/**
var txt = this.txt = new PixiTextInput("");
txt.style = hx.style;
txt.y = 550;
txt.x += 10;
txt.height = 45;
txt.width = 200;
**/
//chat.addChild(txt);
chat.addChild(log);
/** misc area **/
misc = new PIXI.Graphics();
misc.beginFill(0x3c312b);
misc_pos = { x : 700, y:500};
misc.drawRect(misc_pos.x,misc_pos.y,100,200);
misc.endFill();
that.misc = misc;
/* menu buttons */
misc.beginFill(0x604E44);
misc.drawRect(misc_pos.x, 500, 75, 30);
misc.drawRect(misc_pos.x, 550, 75,30);
var menuTxt =  new PIXI.Text('Menu (esc)',{font : '15px Arial', fill : 'white', align : 'center'});
var optTxt =  new PIXI.Text('Options',{font : '15px Arial', fill : 'white', align : 'center'});
menuTxt.x = misc_pos.x;
menuTxt.y = 500;

optTxt.x = misc_pos.x;;
optTxt.y = 550;
//604E44
misc.addChild(menuTxt);
misc.addChild(optTxt);
misc.endFill();
// present **/

viewport_.addChild(that.camera);
graphics.addChild(viewport_);
graphics.addChild(chat);
graphics.addChild(misc);
stage.addChild(graphics);
};

Loader.Renderer.prototype.startRender = function ()
{
    var that = this;
    // run the render loop
    animate();
    function animate() {
        that.renderer.render(that.stage);	
        that.renderFunction();
        that.renderPlayers();
        requestAnimationFrame( animate );
    }
};

Loader.Renderer.prototype.addPlayer = function(player){
       var that = this;
       p = new Loader.Renderer.RendererPlayer(player);
        that.camera.addChild(p.graphics);
       this.players.put(player, p);
       
};
Loader.Renderer.prototype.addText = function (txt){
    this.log.text+= txt+"\n";
}
Loader.Renderer.prototype.deletePlayer = function(player){

};
Loader.Renderer.prototype.renderPlayers = function () {
    var that = this;
    keys = that.players.keys();
    for(i in keys)
    {
        item = keys[i];
		//console.log(item.name);
        //item.update();
        point = item.point();
        x = point.x;
        y = point.y;
        
        p = that.players.get(item).graphics.position;
        p.x = x;
        p.y = y;
        
    }
};
Loader.Renderer.RendererPlayer = function (player) {
     var that = this;
		this.graphics = new PIXI.Graphics();
        that.graphics.position = new PIXI.Vector(0,0);
		that.graphics.lineStyle(3,0xFFFFFF);
		that.graphics.beginFill(0xE56E56, 1);
		//that.graphics.drawCircle(hx.constants.Player.RADIUS, 50,hx.constants.Player.RADIUS * hx.constants.World.SCALE);
        that.graphics.drawCircle(0,0,30 * hx.constants.Player.RADIUS )//* hx.constants.World.SCALE);
		that.graphics.endFill();
		that.name_label = new PIXI.Text(player.name,{font : '25px Arial', fill : 'white', align : 'center'});
		//that.avatar_label = new PIXI.Text("",{font : '25px Arial', fill : 'white', align : 'center'});
		//that.avatar_label.x = Loader.constants.RADIUS-7.50;
		//that.avatar_label.y = (50)-15;
		that.name_label.y = 30 * hx.constants.Player.RADIUS;
        //this.setAvatar(player.avatar);
		//that.graphics.addChild(that.avatar_label);
		that.graphics.addChild(that.name_label);
}
Loader.Renderer.RendererPlayer.prototype.setAvatar = function (avatar) {

};
//NetRenderer.prototype.constructor=NetRenderer;
Loader.Client.Renderer = function()
{
	this.prototype = new Loader.Renderer();
	this.prototype.renderPlayers = this.renderPlayers;	
	
}
Loader.Client.Renderer.prototype.addPlayer = function(peer_id,name){
       var that = this;
       p = new Loader.Client.Renderer.RendererNetPlayer(name);
       that.prototype.camera.addChild(p.graphics);
       this.prototype.players.put(peer_id, p);
	   
       
};
Loader.Client.Renderer.prototype.renderPlayers = function () {
    var that = this;
    keys = that.players.keys();
    for(i in keys)
    {
        item = that.players.get(keys[i]);
        point = item.point;
        
        item.graphics.position.x = point.x;
        item.graphics.position.y = point.y;

    }
};
Loader.Client.Renderer.RendererNetPlayer = function (name) {
     var that = this;
		this.graphics = new PIXI.Graphics();
        that.graphics.position = new PIXI.Vector(0,0);
		that.graphics.lineStyle(3,0xFFFFFF);
		that.graphics.beginFill(0xE56E56, 1);
		//that.graphics.drawCircle(hx.constants.Player.RADIUS, 50,hx.constants.Player.RADIUS * hx.constants.World.SCALE);
        that.graphics.drawCircle(0,0,30 * hx.constants.Player.RADIUS )//* hx.constants.World.SCALE);
		that.name_label = new PIXI.Text(name,{font : '25px Arial', fill : 'white', align : 'center'});
		that.name_label.y = 30 * hx.constants.Player.RADIUS;

		that.graphics.endFill();
		
		this.point = {x:0,y:0};
				that.graphics.addChild(that.name_label);

}
/** experimental **/
Loader.UI = function()
{
	this.max = 8;
	this.getNick();
	this.listRooms();
	this.createListeners();
}

Loader.UI.prototype.getNick = function()
{
	$('#nick-modal').modal().show();
}
Loader.UI.prototype.addPlayer = function(player)
{
	p = game.createPlayer(player,"20");
	game.net.clients.put(player,p);
}
Loader.UI.prototype.playerDC = function (con)
{
	console.log(con);
	game.net.clients.remove(con.peer);
	game.addText("* "+con.peer+"has left");
}
Loader.UI.prototype.joinRoom = function (host)
{
	var that = this;
	callbacks = {on_host_connect:this.initClientRoom,
				on_error : this.hostError
				};
	game.net = new Loader.Net();
	game.net.joinRoom(host	,callbacks);
}
Loader.UI.prototype.initClientRoom = function ()
{
	/** clear old html and place canvas **/
	this.cache	 = $('body').html();
	$('body').html("<div id='game-view'></div>");
	$('body').css({'padding-top':'10px'});
	/** add host **/
	game.renderer = new Loader.Client.Renderer();
	/*!-- !*/
	game.renderer.prototype.startRender();
	console.log(game.ui.nick);
	game.renderer .addPlayer('host','host');
	game.renderer .addPlayer(game.net.peer.id,game.ui.nick);
	game.controller = new Loader.Client.Controller();
	game.net.startUpdates();
}


Loader.UI.prototype.createRoom = function ()
{
	var that = this;
	callbacks = {
		on_peer_init:function () {that.createRoomDB();that.initHostRoom()},
		on_error : this.hostError,
		on_peer_connect : this.addPlayer,
		on_peer_dc : this.playerDC
	};
	game.net = new Loader.Net();
	game.net.createRoom(callbacks);
}

Loader.UI.prototype.initHostRoom = function ()
{
	/** clear old html and place canvas **/
	this.cache = $('body').html();
	$('body').html("<div id='game-view'></div>");
	$('body').css({'padding-top':'10px'});
	/** add host **/
	game.createRenderer().startRender();
	new Loader.Host.Controller(game.createPlayer(this.nick,"avatar"));
	game.net.startUpdates();
}
Loader.UI.prototype.exitRoom = function()
{
	$('body').html(this.cache);
	$('body').css({'padding-top':'70px'});
	game.net.peer.disconnect();
	this.listRooms();
	this.createListeners();
}
/** unstable **/
Loader.UI.prototype.hostError = function (err)
{
	console.log("unable to create room");
	console.log(err);
}
/** stable **/

Loader.UI.prototype.createRoomDB = function ()
{
	$.post("/create_room",encodeURI("name="+this.room_name+"&peer="+game.net.peer.id+"&max="+this.max+"&ver="+hx.version));
}
Loader.UI.prototype.listRooms = function()
{
	$.getJSON( "/get_rooms", function( data ) {
	var items = [];

		$.each( data, function( key, val ) {
			pass = val.pass ? "Yes" : "No";
			distance = key * 20;
			$('#roomlist-table tbody').append('<tr peer='+val.peer+' class=\'clickable-row\'><td>'+val.name+'</td><td>'+val.players+'/'+val.max+'</td><td>'+pass+'</td><td>'+distance+'</td></tr>');
		});
	})

};

Loader.UI.prototype.createListeners = function()
{
	var that = this;
	$('#join').on('click',function () {
		that.joinRoom(that.selected_room)
	});
	$('#refresh').on('click',function () {
		that.listRooms();
	});
	$('#create').on('click',function () {
		$('#room').attr('value',that.nick + "'s room");
		$('#myModal').modal().show();
	});
		
	$('#roomlist-table').on('click', 'tbody tr',function(event) {
				that.selected_room = $(this).attr("peer");
				$(this).addClass('active').siblings().removeClass('active');
				$('#join').attr("disabled", false);
	});
				
		$('#roomlist-table').on('dblclick', 'tbody tr',function(event) {
				that.joinRoom(($(this).attr("peer")))
	});
	$('#play').on('click',function () {
		that.nick=$('#nick').val();$('#nick-modal').modal('hide')
	})
	$('#create_room_modal').on('click',function () {
		that.room_name= $('#room').val();that.createRoom();
	});
}
