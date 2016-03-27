var ExpressPeerServer = require('peer').ExpressPeerServer;
var express = require("express")
app = express();
//app.use(express.static('.'));
/**
app.get("/js/Box2dWeb-2.1.a.3.min.js", function(req,res){res.sendFile(__dirname+"/js/Box2dWeb-2.1.a.3.min.js");});
app.get("/js/loader.js", function(req,res){res.sendFile(__dirname+"/js/loader.js");});
app.get("/js/fake-rooms.js", function(req,res){res.sendFile(__dirname+"/js/fake-rooms.js");});
app.get("/js/constants.js", function(req,res){res.sendFile(__dirname+"/js/constants.js");});
app.get("/js/navigation.js", function(req,res){res.sendFile(__dirname+"/js/navigation.js");});
app.get("/js/pixi.min.js", function(req,res){res.sendFile(__dirname+"/js/pixi.min.js");});
app.get("/js/pixi.vector.js", function(req,res){res.sendFile(__dirname+"/js/pixi.vector.js");});
**/
app.use('/js', express.static('js'));

app.get("/", function(req,res){res.sendFile(__dirname+"/html/entry.html");});
app.get("/create_room",function (req,res){
	
})

server = app.listen(process.env.port || 8888);
var options = {
    debug: true
};
app.use('/api', ExpressPeerServer(server, options));
