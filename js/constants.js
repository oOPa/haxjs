var hx = {};
hx.constants = {};
console.log("Loading constants");
hx.server = {};
hx.server.host = "localhost";
hx.server.port = 8888;
hx.server.key = "peerjs";
hx.version = 0.1;
hx.constants.World = {
    FRICTION:0.1,
    SCALE:30,
    WIDTH:940,
    HEIGHT:480
};

hx.constants.Ground = {
    DENSITY:1.0,
    FRICTION:1,
    RESTITUTION:0.5
};

hx.constants.Player = {
    DENSITY:1,
    FRICTION:0.5,
    RESTITUTION:0.2,
    AD:2,
    LD:2,
    MAG:12,
    RADIUS:0.5
};

hx.constants.Ball = {
    DENSITY:1,
    FRICTION:0,
    RESTITUTION:0.2,
    AD:2,
    LD:2,
    MAG:12,
    RADIUS:0.35
};

hx.constants.Directions = {
    39:0,
    40:3,
    37:2,
    38:1
}
/** maping for online connections **/
hx.constants.OnlineDirections = {
    'w':1,
    's':3,
    'a':2,
    'd':0
}

hx.grounds = {};
hx.grounds.G1 = {
    top:[0, 10, hx.constants.World.WIDTH, 10],
    right:[hx.constants.World.WIDTH - 10, 0, 10, hx.constants.World.HEIGHT],
    bottom:[0, hx.constants.World.HEIGHT - 10, hx.constants.World.WIDTH, 10],
    left:[10, 0, 10, hx.constants.World.HEIGHT]
};
hx.grounds.G2 = {
    top:[0, 10, hx.constants.World.WIDTH, 10],
    right:[hx.constants.World.WIDTH - 10, 0, 100, hx.constants.World.HEIGHT],
    bottom:[0, hx.constants.World.HEIGHT - 10, hx.constants.World.WIDTH, 10],
    left:[10, 0, 10, hx.constants.World.HEIGHT]
};
hx.style = {font : '15px Arial', fill : 'white'};