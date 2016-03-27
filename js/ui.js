Loader.UI = function()
{
	this.loadRooms();
	this.initTable();
}
Loader.UI.prototype.createRoom = function ()
{
	//window.net = 
}
Loader.UI.prototype.loadRooms = function()
{
	rooms = window.roomlist.rooms;
	for(i in rooms)
	{
		room = rooms[i];
		pass = room.pass ? "Yes" : "No";
		distance = i * 20;
		$('#roomlist-table tbody').append('<tr class=\'clickable-row\'><td>'+room.name+'</td><td>'+room.players+'/'+room.maxplayers+'</td><td>'+pass+'</td><td>'+distance+'</td></tr>');
	}
}
Loader.UI.prototype.initTable = function()
{
	var that = this;
	$('#roomlist-table').on('click', 'tbody tr',function(event) {
		that.room_index = $(this).closest('tr').index()
				$(this).addClass('active').siblings().removeClass('active');
				$('#join').attr("disabled", false);
	});
				
		$('#roomlist-table').on('dblclick', 'tbody tr',function(event) {
				room_index = $(this).closest('tr').index()
				console.log(window.roomlist.rooms[room_index])
	});
	
	$('#join').on('click',function(){
		console.log(window.roomlist.rooms[that.room_index])
	});
	$('#refresh').on('click',function(){
		that.loadRooms();
	});
	$('#create').on('click',function(){
		that.createRoom();
	});
}
