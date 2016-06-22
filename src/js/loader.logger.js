var Logger = function()
{
	
}
Logger.prototype.addChat = function(txt)
{
	this.log(txt);
}
Logger.prototype.log = function(txt)
{
	console.log("haxjs: "+txt)
}