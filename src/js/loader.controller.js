class Controller{
     constructor(player){
        this.player = player;

   document.addEventListener('keydown', (e) => {
        if (e.keyCode > 36 && e.keyCode < 41) {
            this.player.keys[hx.constants.Directions[e.keyCode]] = true;		
			console.log(e.keyCode);            
        }
    });
    document.addEventListener('keyup', (e) => {
            this.player.keys[hx.constants.Directions[e.keyCode]] = false;			
			console.log(e.keyCode);

    });

}
}