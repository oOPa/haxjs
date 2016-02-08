var peer = new Peer({host : "haxjs.cloudapp.net",port:80,key:"peerjs"});
peer.on('open', function(id) {
	console.log('My peer ID is: ' + id);
}); 
var conn = peer.connect('host');
conn.on('open', function(){
  console.log("connected to host!");
  document.addEventListener('keyup',function(e){
		conn.send(e.keyCode);
	});
	document.addEventListener('keydown',function(e){
		if (e.keyCode > 36 && e.keyCode < 41) {
			n = (parseInt(e.keyCode)+100);
			conn.send(n);
		}
	})
	
  });
conn.on('data',function(dataConnection){
	/** on receive data from host **/
});

var sendTxt = function()
{
	msg_p=document.createElement("p");
	txt = 	document.getElementById("text");
	msg = document.createTextNode(txt.value);
	//txt.value = "";
	msg_p.appendChild(msg);
	document.getElementById("peer").appendChild(msg_p);
}
