// -----JS CODE-----
//@input Component.ScriptComponent detect
//@input SceneObject shape

var unit_cube = 2;
var transformShape = script.shape.getTransform();

script.api.collisionCheck = function(point){
    var thickness = unit_cube * transformShape.getLocalScale().y;
    var radius = unit_cube/2 * transformShape.getLocalScale().x; //assume circle (x scale = z scale)
    var normal = transformShape.up.normalize();
    var origin = transformShape.getWorldPosition().add(normal.uniformScale(thickness/2));
    var dist_pointToPlane = normal.dot(point.sub(origin));
    var projected_point = point.sub(normal.uniformScale(dist_pointToPlane));
    var dist_projectedToOrigin = projected_point.sub(origin).length;
    var collided = (Math.abs(dist_pointToPlane) < thickness && dist_projectedToOrigin <= radius) ? true : false;
    var outRadius = dist_projectedToOrigin/transformShape.getLocalScale().x;
    var adjust = (dist_pointToPlane >-3) ? normal.uniformScale(dist_pointToPlane) : normal.uniformScale(0);
    return [collided,adjust,outRadius];
}

script.api.getObject = function(){
    return script.getSceneObject();
}

function Register(){
    if (script.detect.api) {
        script.detect.api.AddCylinder(script);
    }
}

Register();