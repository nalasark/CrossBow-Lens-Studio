// -----JS CODE-----
//@input Component.ScriptComponent detect
//@input bool point

script.api.pos = script.getSceneObject().getTransform().getWorldPosition();
script.api.minX = 0;
script.api.minY = 0;
script.api.minZ = 0;
script.api.maxX = 0;
script.api.maxY = 0;
script.api.maxZ = 0;

var unit_cube = 15;

function Register(){
    if (script.detect.api) {
        if (script.point) script.detect.api.SetPoint(script);
        if (!script.point)  script.detect.api.AddAABB(script);
    }
}

script.api.UpdatePosition = function() {
    script.api.pos = script.getSceneObject().getTransform().getWorldPosition();
}

script.api.MinMaxCalculations = function(){
    var pos = script.getSceneObject().getTransform().getWorldPosition();
    var scale = script.getSceneObject().getTransform().getWorldScale();
    
    var halfW = unit_cube * scale.x / 2.0;
    var halfH = unit_cube * scale.y / 2.0;
    var halfB = unit_cube * scale.z / 2.0;

    script.api.minX = pos.x - halfW;
    script.api.minY = pos.y - halfH;
    script.api.minZ = pos.z - halfB;
    script.api.maxX = pos.x + halfW;
    script.api.maxY = pos.y + halfH;
    script.api.maxZ = pos.z + halfB;
}

//script.api.Intersection = function(other) {
//    if (call != null) call(other);
//}

//script.api.AddTriggerCallback = function(callback) {
//    call = callback;
//}

Register();