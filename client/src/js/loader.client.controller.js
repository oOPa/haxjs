Loader.Client.Controller = function(player){
        var that = this;
        that.keys = [false,false,false,false];
        that.Directions = hx.constants.Directions;
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
};