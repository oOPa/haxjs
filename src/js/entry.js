var Haxball = require("./loader.js").Haxball;
var ui = require("./loader.ui.js").HaxballUI;

//console.log(Haxball);
$( document ).ready(function() {
    //console.log( "ready!" );
	//console.log("it works");
	window.haxball = new Haxball();
	window.haxball.ui = new ui();
});