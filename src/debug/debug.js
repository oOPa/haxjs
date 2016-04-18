Loader.Debug = function(type)
{
	this.type = type;
	this.room_name = "dev's room"
	this.nick = 'dev'
	
	game.ui.nick = this.nick
	game.ui.room_name= this.room_name
	
	if(this.type == 1)
	{
		/** CREATE ROOM **/
		game.ui.createRoom();
	}
	else if(this.type == 2)
	{
		/** JOIN A CREATED ROOM **/
		game.ui.nick = 'player2'
		game.ui.joinRoom("pi7cq659rfs3v7vi");
	}
}