var HaxballUI = function()
{
	this.load();
}
HaxballUI.prototype.load = function()
{
	this.max = 8;
	this.nick = "DEFAULT NICKNAME";
	this.listRooms();
	this.createListeners();	
};
//rename this function
HaxballUI.prototype.getNick = function()
{
	$('#nick-modal').modal().show();
}
HaxballUI.prototype.joinRoom = function(host)
{
	var that = this;
	window.net=new Net();
	window.net.joinRoom(host);
}

HaxballUI.prototype.createRoom =function()
{
	var that = this;
	this.net = new Net(true);
	window.net=this.net;
	this.net.createRoom();
}

HaxballUI.prototype.exitRoom =function()
{
	$('body').html(this.cache);
	$('body').css({'padding-top':'70px'});
	this.net.peer.disconnect();
	this.listRooms();
	this.createListeners();
}
/** stable **/
HaxballUI.prototype.createRoomDB =function ()
{
	$.post("/create_room",encodeURI("name="+this.room_name+"&peer="+this.net.peer.id+"&max="+this.max+"&ver="+hx.version));
}
HaxballUI.prototype.listRooms =function()
{
	$.getJSON( "/get_rooms", function( data ) {
	var items = [];
		$.each( data, function( key, val ) {
			var pass = val.pass ? "Yes" : "No";
			var distance = key * 20;
			$('#roomlist-table tbody').append('<tr peer='+val.peer+' class=\'clickable-row\'><td>'+val.name+'</td><td>'+val.players+'/'+val.max+'</td><td>'+pass+'</td><td>'+distance+'</td></tr>');
		});
	})

}
HaxballUI.prototype.createListeners=function ()
{
	var that = this;
	$('#join').on('click',function(){
		that.joinRoom(that.selected_room);
	});
	$('#refresh').on('click',function(){
		that.listRooms();
	});
	$('#create').on('click',function(){
		$('#room').attr('value',that.nick + "'s room");
		$('#myModal').modal().show();
	});
		
	$('#roomlist-table').on('click', 'tbody tr',function(event) {
				that.selected_room = $(this).attr("peer");
				$(this).addClass('active').siblings().removeClass('active');
				$('#join').attr("disabled", false);
	});
				
		$('#roomlist-table').on('dblclick', 'tbody tr',function(event) {
				that.joinRoom(($(this).attr("peer")));
	});
	$('#play').on('click',function(){
		that.nick=$('#nick').val();$('#nick-modal').modal('hide');
	})
	$('#create_room_modal').on('click',function(){
		that.room_name= $('#room').val();that.createRoom();
	});
}

