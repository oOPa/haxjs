var Controller = function(player){
        var that = this;
        this.player = player;
        that.keys = [false,false,false,false];
        //that.keys = [true,true,true,true]
        that.Directions = {
        39:0,
        40:3,
        37:2,
        38:1
    }
    player.update = function()
    {
       //console.log("gotcha")
        return that.update();
    }
    
   document.addEventListener('keydown', function (e) {
        if (e.keyCode > 36 && e.keyCode < 41) {
            that.keys[that.Directions[e.keyCode]] = true;		
			console.log(e.keyCode);
            
        }
    });
    document.addEventListener('keyup', function (e) {
            that.keys[that.Directions[e.keyCode]] = false;			
			console.log(e.keyCode);
  //          if(e.keyCode == 17){window.switchp();}
           
    });


    this.update = function (params) {
        //console.log("a");
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
            //console.log(that.player.physics.body.getPosition);
            that.player.physics.body.ApplyForce(vec, that.player.physics.body.GetWorldCenter());
            console.log(that.player.point());

        }
        return "updated";
    }

}