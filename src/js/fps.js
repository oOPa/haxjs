var fps = 60;
var prevTime = 0;
function enterFrameHandler(currentTime) {
      
     var timeStep = 1/fps;       
     var frameTime = (currentTime - prevTime) / 1000;      
      
     if ( frameTime > 0.25 )
     {
        frameTime = 0.25;            
     }
     
     prevTime = currentTime;      
     timeAccumulator += frameTime;      
     while(timeAccumulator >= timeStep)
     {   
          updatePhysics(timeStep);
          timeAccumulator -= timeStep;
     }      
     //clear forces
     //interpolate
     var alpha = timeAccumulator / timeStep;      
     updateGraphics(alpha);               
}
//interpolate
function updateGraphics(alpha)
{
      
      for (b in gameBodies)
      {
         var posX = b.getPosition().x  * PHYSICS_SCALE;
         var posY = b.getPosition().y  * PHYSICS_SCALE;         
            
         var posXIntp = userData.prevPosX * (1 - alpha) + posX * alpha;
         var posYIntp = userData.prevPosY * (1 - alpha) + posY * alpha;   
      }
}