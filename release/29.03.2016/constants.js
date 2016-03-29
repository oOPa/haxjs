var hx = {};
hx.constants = {};
hx.server = {};
hx.server.host = "haxjs-port.cloudapp.net";
hx.server.port = 80;
hx.server.key = "peerjs";
hx.version = 0.1;
hx.intervals = 1;
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

hx.constants.Directions = {
    39:0,
    40:3,
    37:2,
    38:1
};


hx.style = {font : '15px Arial', fill : 'white'};
hx.label_size = 10;