class Controller{
     constructor(player){
        this.player = player;

   document.addEventListener('keydown', (e) => {
        if(e.keyCode in hx.constants.Action)
        {
            console.log(("down"))
            this.player.action = true;
        }
        if (e.keyCode > 36 && e.keyCode < 41) {
            this.player.keys[hx.constants.Directions[e.keyCode]] = true;
            //this.player.addKeys();
        }
    });
    document.addEventListener('keyup', (e) => {
            this.player.keys[hx.constants.Directions[e.keyCode]] = false;
            if(e.keyCode == 27)
            {
                //show lobby
                window.net.renderer.toggleLobby();
            }
            if(e.keyCode in hx.constants.Action)
        {
            console.log(("up"))
            this.player.action = false;
        }
    });
    
    }
}

class ControllerClient{
     constructor(player,net){
        this.player = player;
        this.net = net;
   document.addEventListener('keydown', (e) => {
        if (e.keyCode > 36 && e.keyCode < 41) {
            this.player.keys[hx.constants.Directions[e.keyCode]] = true;	
            this.net.sendInputToHost();	         
        }
    });
    document.addEventListener('keyup', (e) => {
            this.player.keys[hx.constants.Directions[e.keyCode]] = false;	
            this.net.sendInputToHost();		
    });
}
}
