var Controller = function(player){
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


    this.forces = function () {
        var vec = new PIXI.Vector(0, 0);
        window.vec = new PIXI.Vector(0, 0);
        that.keys.forEach(function (key, i) {
        if (key) {
                var vec2 = new Physics.Vec(i * -90,200);
            vec.add(vec2.vec);
        }
        });
        
        if (vec.length() > 0)
        {
            that.player.physics.body.ApplyForce(vec, that.player.physics.body.GetWorldCenter());

        }

    }

}