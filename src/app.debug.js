var that = this;
var DB_URL = "mongodb://localhost/haxball"
var ExpressPeerServer = require('peer').ExpressPeerServer;
var express = require("express")
var app = express();
const MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var options = {
    debug: true
};

/** Room management **/
var create_room = function (req,res)
{
	rooms = that.rooms;
	rooms.insert({
		name : req.body['name'],
		peer : req.body['peer'],
		players	: 1,
		max	:	req.body['max'],
		country	:	'gb',
		lat	: "0",
		longitude	: "0",
		version	: req.body['ver'],
		pass : 0
	});
	res.end();
}
var get_rooms = function(req,res)
{
	var cursor = that.rooms.find();
	res.contentType("application/json");
	var firstItem=true;
	cursor.each(function(err,item){
		if(item == null) {
		res.end(firstItem ? '[' : '' + ']');
        return;
    }
		res.write(firstItem ? (firstItem=false,'[') : ',');
		res.write(JSON.stringify(item));
	});
}
var remove_player = function(peer) {
	x = that.rooms.remove({"peer":{"$eq":peer}});
}
/** routes **/


app.post("/create_room",create_room);
app.get("/get_rooms",get_rooms);
app.get("/", 							function(req,res){res.sendFile(__dirname+'/html/index.html')});

/*
app.get("/js/Box2dWeb-2.1.a.3.min.js", function(req,res){res.sendFile(__dirname+'/Box2dWeb-2.1.a.3.min.js')});
app.get("/js/constants.js", function(req,res){res.sendFile(__dirname+'/constants.js')});
app.get("/js/loader.min.js", function(req,res){res.sendFile(__dirname+'/loader.min.js')});
app.get("/js/pixi.vector.js", function(req,res){res.sendFile(__dirname+'/pixi.vector.js')});
app.get("/js/hashtable.js", function(req,res){res.sendFile(__dirname+'/hashtable.js')});

*/
app.use('/js', express.static('js'));

/** load servers **/
server = app.listen(process.env.port || 8888);
var epe = ExpressPeerServer(server, options)
epe.on('disconnect',remove_player)
app.use('/api',epe);
/**DATABASE connection**/
MongoClient.connect(DB_URL, (err, database) => {
  // ... start the server
	;
  if(err) {console.log(err)}
  else{that.rooms = database.collection('rooms');that.rooms.remove();}
});
