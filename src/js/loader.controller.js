class Controller{
     constructor(player){
        this.player = player;

   document.addEventListener('keydown', (e) => {
        if (e.keyCode > 36 && e.keyCode < 41) {
            this.player.keys[hx.constants.Directions[e.keyCode]] = true;     
        }
    });
    document.addEventListener('keyup', (e) => {
            this.player.keys[hx.constants.Directions[e.keyCode]] = false;
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
            this.net.sendToHost();	           
        }
    });
    document.addEventListener('keyup', (e) => {
            this.player.keys[hx.constants.Directions[e.keyCode]] = false;	
            this.net.sendToHost();			
    });
}
}