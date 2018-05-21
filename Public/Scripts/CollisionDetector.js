// -----JS CODE-----
//@input Component.ScriptComponent arrow
//@input Component.ScriptComponent text
var shooting = false;
var colliders = [];
var point;

script.api.UpdateShooting = function (val) {
    shooting = val;
}

script.api.AddCylinder = function (cylinder) {
    colliders.push(cylinder);
}

script.api.SetPoint = function (p) {
    point = p;
}

function CheckCollision(){
    if(!shooting) return;
    
    var hitPos = script.arrow.getTransform().getWorldPosition();
    var hitRot = script.arrow.getTransform().getWorldRotation();  
    //if (point != null) point.api.UpdatePosition();
    for (x=0;x<colliders.length;x++){
        var collided = colliders[x].api.collisionCheck(point.api.GetPosition());
        if (collided[0]){
            //hitPos = hitPos.sub(collided[1]); //adjust back - but causes weird shift
            script.arrow.api.intersect(colliders[x].api.getObject(),hitPos,hitRot);
            print("INTERSECTED");
            script.text.api.hit(collided[2]);
            break;        
        }
    }

}

var event = script.createEvent("UpdateEvent");
event.bind(CheckCollision);