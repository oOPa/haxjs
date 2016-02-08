var play = function()
{
	nick = document.getElementById("nickname-text").value;
	if(nick.length >0)
	{
		$(".login").css({"display" : "none"})
		/** load room list **/
		//$(".load-roomlist").css({"display" : "inline"})
		list = {
	ver:0.1,
	rooms : [
	{
		ver :0.1,
		host : "00000",
		name : "02323",
		players : 0,
		maxplayers : 8,
		pass : 0,
		country : 'gb',
		lat : 0,
		longitude :0
	},
		{
		ver :0.1,
		host : "00000",
		name : "02323",
		players : 0,
		maxplayers : 8,
		pass : 0,
		country : 'gb',
		lat : 0,
		longitude :0
	},
		{
		ver :0.1,
		host : "00000",
		name : "02323",
		players : 0,
		maxplayers : 8,
		pass : 0,
		country : 'gb',
		lat : 0,
		longitude :0
	},
		{
		ver :0.1,
		host : "00000",
		name : "02323",
		players : 0,
		maxplayers : 8,
		pass : 0,
		country : 'gb',
		lat : 0,
		longitude :0
	},
		{
		ver :0.1,
		host : "00000",
		name : "02323",
		players : 0,
		maxplayers : 8,
		pass : 0,
		country : 'gb',
		lat : 0,
		longitude :0
	}	
	]
};
		rooms = list.rooms;
		for(i in rooms)
		{
			room = rooms[i];
			pass = room.pass ? "Yes" : "No";
			distance = i * 20;
			$('#roomlist-table tbody').append('<tr onclick="enterRoom(\''+room.host+'\')"><td>'+room.name+'</td><td>'+room.players+'/'+room.maxplayers+'</td><td>'+pass+'</td><td>'+distance+'</td></tr>');
		}
		//$(".roomlist").css({"display" : "inline",'background-color':'#3c312b'})
		$("#roomlist").removeClass("hide");
		$("#roomlist").addClass("roomlist");
	}
}
function enterRoom(host)
{
	$("#roomlist").addClass("hide");
	//create canvas
	$('#app-content').append($('<canvas>').attr({
		'id' : 'haxball',
		'height': '200',
		'width' : '500'
	}));
	window.hxp = new hx.Builder();
}