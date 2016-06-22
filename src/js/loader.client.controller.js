class ControllerClient{
    constructor(){
        this.keys = [false,false,false,false];
        this.Directions = hx.constants.Directions;
        this.addActionListeners();
    }
    addActionListeners(){
		document.addEventListener('keydown',  (e) => {
        if (e.keyCode > 36 && e.keyCode < 41) {
            this.keys[this.Directions[e.keyCode]] = true;		
			console.log(e.keyCode);            
        }
        
		});
		document.addEventListener('keyup', (e) => {
            this.keys[this.Directions[e.keyCode]] = false;			
			console.log(e.keyCode);          
    });
    }
}