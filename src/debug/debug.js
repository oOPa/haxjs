Loader.Debug = function(type)
{
	this.type = type;
	this.room_name = "dev's room"
	this.nick = 'dev'
	
	game.ui.nick = this.nick
	game.ui.room_name= this.room_name
	
	if(this.type == 1)
	{
		game.ui.createRoom();
	}
}