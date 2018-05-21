// -----JS CODE-----
//@input Component.ScriptComponent arrow
var shooting = false;
var colliders = [];
var point;

script.api.UpdateShooting = function (val) {
    shooting = val;
}

script.api.AddAABB = function (aabb) {
    colliders.push(aabb);
}
script.api.SetPoint = function (p) {
    point = p;
}

function isPointInsideAABB(point, box) {
  return (point.api.pos.x >= box.api.minX && point.api.pos.x <= box.api.maxX) &&
         (point.api.pos.y >= box.api.minY && point.api.pos.y <= box.api.maxY) &&
         (point.api.pos.z >= box.api.minZ && point.api.pos.z <= box.api.maxZ);
}

function CheckCollision(){
    if(!shooting) return;
    //print("checking");
    
    //recalculate AABB for all box colliders
    if (point != null) point.api.UpdatePosition();
    for (x=0;x<colliders.length;x++){
        try{
            colliders[x].api.MinMaxCalculations();
        } catch (err) {
            colliders.splice(x,1);
            x--;
        }
    }
    
    //check for collision
    for (x=0;x<colliders.length;x++){
        var col = colliders[x];
        if (isPointInsideAABB(point,col)){
            script.arrow.api.intersect();
            print("INTERSECTED1");
        }
    }
}

var event = script.createEvent("UpdateEvent");
event.bind(CheckCollision);