Loader.Logger = function()
{
	
}
Loader.Logger.prototype.addChat = function(txt)
{
	this.log(txt);
}
Loader.Logger.prototype.log = function(txt)
{
	console.log("haxjs: "+txt)
}