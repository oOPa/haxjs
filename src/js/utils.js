
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
 var lerp = function (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
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
var State = function(velocity,position)
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
var make_room_host = function(room_name,peer){
    var max = 8;
    	$.post("/create_debug",encodeURI("name="+room_name+"&peer="+peer+"&max="+max+"&ver="+hx.version));
}
var join_debug_room = function()
{
	$.get("/get_debug_room",function(data)
	{
		window.net=new Net(false,'client');window.net.joinRoom(data);
	});
}
var getMessage=function ()
{
	var msg = $("#chat-text").val();
	$("#chat-text").empty();
	return msg;
}
var getTimeMs = function()
{
	return new Date().getTime();
}
var InputBuffer = function(len)
{
	this.len = len;
	this._pointer = -1;
	//this._arr = new Array();
	this._arr = create2dArray(len,4);
}
InputBuffer.prototype.add = function (args)
{
	this._arr[(++this._pointer)%this.len] = args;
}
InputBuffer.prototype.reset = function()
{
	this._arr = new Array();
}
InputBuffer.prototype.getBuffer = function ()
{
	return this._arr;
}
var createArray = function(n)
{
var arr = new Array();
       for (var i=0;i<n;i++)
       {
		   arr[i] = 0;
	   }
	   return arr;
}
var create2dArray = function (n,m)
    {	
	   var arr = new Array();
       for (var i=0;i<n;i++)
       {
            arr[i]= new Array();
            for (var j=0;j<m;j++)
            {
                arr[i][j]=0;
            }
        }
    
	   return arr;
    }

var PlaybackQueue = function()
{
    this.len = hx.playbackQueueMax;
    this.arr = createArray(this.len);
    this.access_pointer = -1;
    this.insert_pointer = -1;
}
PlaybackQueue.prototype.add = function (frame)
{
	this.arr[this.getNextInsertPointer()] = frame;
}
PlaybackQueue.prototype.getNextInsertPointer = function()
{
	return (this.insert_pointer = (this.insert_pointer +1)%this.len)
}
PlaybackQueue.prototype.hasNext = function()
{
    return (this.access_pointer != this.insert_pointer);
}
PlaybackQueue.prototype.getNext = function()
{
	return this.arr[ this.access_pointer = ((this.access_pointer+1)%this.len)];
}
PlaybackQueue.prototype.getSecond = function()
{
	if(!this.hasNext())
	{
		return this.arr[this.access_pointer];
	}
	else
	{
		return this.getNext();
	}
}
PlaybackQueue.prototype.getBuffer = function ()
{
	return this.arr;
}


var SnapshotIterator = function(snapshot)
{
	this.snapshot = snapshot;
	this.len = snapshot.length;
	this.pointer = 1;
}
SnapshotIterator.prototype.reset = function()
{
	this.pointer = 1;
}
SnapshotIterator.prototype.getSequenceNumber = function()
{
	return this.snapshot[0];
}
SnapshotIterator.prototype.getFrameTime = function()
{
	return this.snapshot[1];
}
SnapshotIterator.prototype.hasNext = function()
{
	return this.pointer != (this.len-1);
}
SnapshotIterator.prototype.getNext = function()
{
	var next = {id:this.snapshot[++this.pointer],data:this.snapshot[++this.pointer]};
	return next;
}
SnapshotIterator.prototype.getObjectById = function(id)
{
	for(var i = 2;i < this.len;i++)
	{
		if(this.snapshot[i] == id)
		{
			return this.snapshot[i+1];
		}
	}
	return false;
}
