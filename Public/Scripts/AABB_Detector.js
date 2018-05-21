// -----JS CODE-----

var colliders = [];

script.api.AddAABB = function (aabb) {
    colliders.push(aabb);
}

function intersect(a,b) {
    return (a.api.minX <= b.api.maxX && a.api.maxX >= b.api.minX) &&
    (a.api.minY <= b.api.maxY && a.api.maxY >= b.api.minY) &&
    (a.api.minZ <= b.api.maxZ && a.api.maxZ >= b.api.minZ);
}

function CheckCollision(){
    
    //recalculate AABB for all box colliders
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
        for (y=x+1;y<colliders.length;y++){
            var colX = colliders[x];
            var colY = colliders[y];
            if (intersect(colX,colY)){
                //colX.api.Intersection(colY);
                //colY.api.Intersection(colX);
                print("INTERSECTION");
            }
        }
    }
}

var event = script.createEvent("UpdateEvent");
event.bind(CheckCollision);