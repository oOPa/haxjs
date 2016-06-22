
class Vec
    {
    constructor (deg, mag) {
    var deg = Physics.deg2rad(deg);
    this.vec = new PIXI.Vector(Math.cos(deg) * mag, Math.sin(deg) * mag);
    }
}
class Utils
{
    static deg2rad (deg) {
        return deg * Math.PI / 180;
    }
}