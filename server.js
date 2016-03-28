var ExpressPeerServer = require('peer').ExpressPeerServer;
var express = require("express")
var app = express();
const MongoClient = require('mongodb').MongoClient;
var that = this;
app.use('/js', express.static('js'));
app.get("/", function(req,res){res.sendFile(__dirname+"/html/entry.html");});
app.get("/create_room",function (req,res){
	rooms = that.rooms;
	rooms.insert({
		name : "Enyinna's room",
		peer : "host",
		players	: 1,
		max	:	8,
		country	:	'gb',
		lat	: "0",
		longitude	: "0",
		version	: "0.1",
		pass : false;
	});
});
app.get("/get_rooms",function(req,res){
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
});

server = app.listen(process.env.port || 8888);
var options = {
    debug: true
};
app.use('/api', ExpressPeerServer(server, options));


MongoClient.connect('mongodb://localhost/haxball', (err, database) => {
  // ... start the server
	;
  if(err) {console.log(err)}
  else{that.rooms = database.collection('rooms')}
});
