// WorldObjectControllerPath.js
// Version: 0.0.3
// Event: Lens Initialized
// Description: Controls the touch, hiding, and showing functionality of the movable character

// SCRIPT INPUTS
//@input bool arrow
//@input Asset.Material touchCollisionMaterial

// If an object with a touch component is defined then this will allow the user to double tap through them to 
// perform a camera swap from back to front cam
global.isTouchingObject = false;
var origin = script.getSceneObject().getTransform().getLocalPosition();

if(script.getSceneObject().getComponentCount("Component.TouchComponent") > 0)
{
    script.getSceneObject().getFirstComponent("Component.TouchComponent").addTouchBlockingException("TouchTypeDoubleTap");
}

// Hides the touchCollision object when lens is running by setting the alpha on its material to 0
if(script.touchCollisionMaterial)
{
    script.touchCollisionMaterial.mainPass.baseColor = new vec4(1,1,1,0);
}

// Event and callback setup  
function onSurfaceReset(eventData)
{
    script.getSceneObject().getTransform().setLocalPosition(origin);
}
var worldTrackingResetEvent = script.createEvent("WorldTrackingResetEvent");
worldTrackingResetEvent.bind(onSurfaceReset);

function onFrontCamEvent(eventData)
{
    for(var i = 0; i < script.getSceneObject().getChildrenCount(); i++)
    {
        var childObject = script.getSceneObject().getChild(i);
        if(childObject)
        {
            childObject.enabled = false;
        }
    }        
}
var cameraFrontEvent = script.createEvent("CameraFrontEvent");
cameraFrontEvent.bind(onFrontCamEvent);

function onBackCamEvent(eventData)
{
    for(var i = 0; i < script.getSceneObject().getChildrenCount(); i++)
    {
        var childObject = script.getSceneObject().getChild(i);
        if(childObject)
        {
            childObject.enabled = true;                   
        }
    }
}
var cameraBackEvent = script.createEvent("CameraBackEvent");
cameraBackEvent.bind(onBackCamEvent);
