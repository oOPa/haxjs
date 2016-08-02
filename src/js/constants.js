var hx = {};
hx.constants = {};
hx.server = {};
hx.server.host = "localhost";
hx.server.port = 8888;
hx.server.key = "peerjs";
hx.version = 0.0.1;
hx.intervals = 10;
hx.fps = 0;
hx.delay = 5;

//hx.playbackBufferTime = hx.intervals * 3 + 50;
hx.playbackBufferTime = hx.intervals * 1.5
//hx.playbackBufferTime = 15;

hx.resolution = {
    width: 500,
    height: 600
}
hx.playbackQueueMax = 50;
//hx.clientBufferSize = 5;
hx.clientSidePredictionEnabled = false;

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
hx.constants.Ball = {
        RADIUS:0.25,
        DENSITY:0.001,
        RESTITUTION:5
}
hx.scale = 
{
    FACTOR:30
}

hx.style = {font : '15px Arial', fill : 'white'};
hx.label_size = 10;

hx.network = {
    PACK:0,
    NICK: 1,
    NEW_PLAYER: 2,
    MOVE: 3,
    CONFIRM: 4,
    CHAT: 5,
    AUTHORITY : 6,
    INPUTS : 7,
    SNAPSHOT : 8,
    ACK : 9
}