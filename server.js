var ExpressPeerServer = require('peer').ExpressPeerServer;
var express = require("express")
var app = express();
const MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');

var that = this;
app.use('/js', express.static('js'));
app.get("/", function(req,res){res.sendFile(__dirname+"/html/entry.html");});

app.use(bodyParser.json());
//app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/create_room",function (req,res){
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
  else{that.rooms = database.collection('rooms');that.rooms.remove();}
});
