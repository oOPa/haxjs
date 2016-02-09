var express = require("express")
app = express();
//app.use(express.static('.'));
app.get("/loader.js", function(req,res){res.sendFile(__dirname+"/loader.js");});
/** should use cdn**/
app.get("/pixi.min.js", function(req,res){res.sendFile(__dirname+"/pixi.min.js");});
/** pixi vectors **/
app.get("/pixi.vector.js", function(req,res){res.sendFile(__dirname+"/pixi.vector.js");});
app.get("/", function(req,res){res.sendFile(__dirname+"/index.html");});
app.get("/create_room",function (req,res){
	
})
app.listen(8888);
