class ControllerClient{
    constructor(player){
        this.player = player;
        this.Directions = hx.constants.Directions;
        this.addActionListeners();
    }
    addActionListeners(){
		document.addEventListener('keydown',  (e) => {
        if (e.keyCode > 36 && e.keyCode < 41) {
            this.player.keys[this.Directions[e.keyCode]] = true;		
			console.log(e.keyCode);            
        }
        
		});
		document.addEventListener('keyup', (e) => {
            this.player.keys[this.Directions[e.keyCode]] = false;			
			console.log(e.keyCode);          
    });
    }
}