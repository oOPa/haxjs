
var Vec = function (deg, mag) {
    var deg = deg2rad(deg);
    this.vec = new PIXI.Vector(Math.cos(deg) * mag, Math.sin(deg) * mag);
    }

var deg2rad = function (deg) {
        return deg * Math.PI / 180;
}
var placeCanvas = function()
{
	/** clear old html and place canvas **/
	window.cache = $('body').html();
	$('body').html("<div id='game-view'></div>");
	$('body').css({'padding-top':'10px'});

}
var addChatRoom = function(sendFunction)
{
    	var chat_div = document.createElement("div");
	chat_div.classList.add("center-block")
	var c = document.createElement("input");
	c.setAttribute("id","chat-text");
	var send = document.createElement("button");
	send.appendChild(document.createTextNode("Send"));
	send.setAttribute("id","chat-send");
	chat_div.appendChild(c);
	chat_div.appendChild(send);
	document.body.appendChild(chat_div);
}
var Pack = function(velocity,position)
{
    this.velocity = velocity;
    this.position = position;
}

var buildBall =function ()
{
        var ball = new DefaultBall(this.physics.world);
        this.renderer.addBall(ball);
}
var make_room = function(room_name,peer){
    var max = 8;
    	$.post("/create_room",encodeURI("name="+room_name+"&peer="+peer+"&max="+max+"&ver="+hx.version));
}
var getMessage=function ()
{
	var msg = $("#chat-text").val();
	$("#chat-text").empty();
	return msg;
}