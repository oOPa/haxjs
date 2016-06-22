class ControllerClient{
    constructor(){
        this.keys = [false,false,false,false];
        this.Directions = hx.constants.Directions;
        this.addActionListeners();
    }
    addActionListeners(){
		document.addEventListener('keydown', function (e) {
        if (e.keyCode > 36 && e.keyCode < 41) {
            that.keys[that.Directions[e.keyCode]] = true;		
			console.log(e.keyCode);            
        }
        
		});
		document.addEventListener('keyup', function (e) {
            that.keys[that.Directions[e.keyCode]] = false;			
			console.log(e.keyCode);          
    });
    }
}