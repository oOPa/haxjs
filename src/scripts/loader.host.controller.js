Loader.Host.Controller = function(player){
        var that = this;
        this.player = player;

   document.addEventListener('keydown', function (e) {
        if (e.keyCode > 36 && e.keyCode < 41) {
            that.player.keys[hx.constants.Directions[e.keyCode]] = true;		
			console.log(e.keyCode);            
        }
    });
    document.addEventListener('keyup', function (e) {
            that.player.keys[hx.constants.Directions[e.keyCode]] = false;			
			console.log(e.keyCode);

    });

};/** host controller ***/