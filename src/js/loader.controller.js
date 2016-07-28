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
     constructor(player,net,inputBuffer){
        this.player = player;
        this.net = net;
        this.inputBuffer = inputBuffer;
   document.addEventListener('keydown', (e) => {
        if (e.keyCode > 36 && e.keyCode < 41) {
            this.player.keys[hx.constants.Directions[e.keyCode]] = true;	
            //this.net.sendToHost();	  
            inputBuffer.add(this.player.keys);         
        }
    });
    document.addEventListener('keyup', (e) => {
            this.player.keys[hx.constants.Directions[e.keyCode]] = false;	
            //this.net.sendToHost();		
            this.inputBuffer.add(this.player.keys);	
    });
}
}
var KeyboardInputBuffer = function()
{
    
}