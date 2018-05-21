// WorldObjectControllerPath.js
// Version: 0.0.3
// Event: Lens Initialized
// Description: Controls the touch, hiding, and showing functionality of the movable character

// SCRIPT INPUTS
//@input bool useGroundGrid
//@input Asset.Material touchCollisionMaterial
//@input SceneObject groundGrid
//@input Component.WorldTracking worldTrackingComponent

// If an object with a touch component is defined then this will allow the user to double tap through them to 
// perform a camera swap from back to front cam
global.isTouchingObject = false;

if(script.getSceneObject().getComponentCount("Component.TouchComponent") > 0)
{
    script.getSceneObject().getFirstComponent("Component.TouchComponent").addTouchBlockingException("TouchTypeDoubleTap");
}

// Hides the ground grid if the option is chosen to do so
if(!script.useGroundGrid && script.groundGrid)
{
    script.groundGrid.enabled = false;
}

// Hides the touchCollision object when lens is running by setting the alpha on its material to 0
if(script.touchCollisionMaterial)
{
    script.touchCollisionMaterial.mainPass.baseColor = new vec4(1,1,1,0);
}

// Event and callback setup  
function onSurfaceReset(eventData)
{
    script.getSceneObject().getTransform().setLocalPosition(new vec3(0, 0, 0));
    setTrackingTarget();
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
    if(!script.useGroundGrid && script.groundGrid)
    {
        script.groundGrid.enabled = false;
    }  
}
var cameraBackEvent = script.createEvent("CameraBackEvent");
cameraBackEvent.bind(onBackCamEvent);

function setTrackingTarget()
{
    if(script.worldTrackingComponent)
    {
        script.worldTrackingComponent.surfaceTrackingTarget = script.getSceneObject();
    }
}
setTrackingTarget();

function manipStart(eventData)
{
    global.isTouchingObject = true;
}
var manipStartEvent = script.createEvent("ManipulateStartEvent");
manipStartEvent.bind(manipStart);

function manipEnd(eventData)
{
    global.isTouchingObject = false;
}
var manipEndEvent = script.createEvent("ManipulateEndEvent");
manipEndEvent.bind(manipEnd);
