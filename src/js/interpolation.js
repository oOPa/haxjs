
// actual code
var past = 1000/tickRate

var now = Date.now() 
var renderTime = now - past // the exact time (in the past) for which we will create a position, in this case this is ~1 tick ago

// timestamp of a previous position (presumably one tick older than t2)
var t1 = previousState.lastUpdate
// timestamp of most recent position update form server
var t2 = this.lastUpdate

// if we have positional data within this time range
if(renderTime <= t2 && renderTime >= t1) {
  // total time from t1 to t2
  var total = t2 - t1
  // how far between t1 and t2 this entity is as of 'renderTime'
  var portion = renderTime - t1

  // fractional distance between t1 and t2
  var ratio = portion / total
  var interpX = math.lerp(previousState.x, this.x, ratio)
  var interpY = math.lerp(previousState.y, this.y, ratio)
  // draw this entity at the interpolated position
  this.drawEntity(interpX, interpY)
} else {
  // no interpolation at all, just draw the raw position
  this.drawEntity(this.x, this.y)
  // in the actual code I attempt some extrapolation when draw is called in a range outside of t1 to t2
  // this usually only occurs if the connection or server lag, and renderTime falls into a window for which we have yet
  // to receive any data
  // tuning the variable 'past' can minimize
}