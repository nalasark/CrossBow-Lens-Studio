// -----JS CODE-----
//@input Component.ScriptComponent detect

var transform = script.getSceneObject().getTransform();

function Register(){
    if (script.detect.api) script.detect.api.SetPoint(script);
}

script.api.GetPosition = function() {
    return transform.getWorldPosition();
}

Register();