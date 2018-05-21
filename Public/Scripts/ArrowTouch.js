// -----JS CODE-----
//@input SceneObject pivotData
//@input SceneObject front
//@input SceneObject end
//@input Component.ScriptComponent detect
//@input Component.ScriptComponent text

var parent = script.getSceneObject().getParent();
var transform = script.getSceneObject().getTransform();

var originPos = transform.getLocalPosition();
var originRot = transform.getLocalRotation();
var originScale = transform.getLocalScale();

var frontPosW; //world position of front of arrow
var endPosW; //world position of end of arrow

var forward; //local forward directional vector of arrow
var forwardW; //world forward directional vector of arrow

var newPosW; //world position (when fired), also to handle parent change
var newRotW; //world rotation (when fired), also to handle parent change

var lastTouchPos;
var totalTouch = 0;

var outForce = 0;

var shooting = false;
var intersected = false;

var curTime;
var nextTime;
var totalTime;

var gravity = 9.81/2;

function startTouch() {
    if (!shooting) {
        script.text.api.disable();
        //reset object
    	script.getSceneObject().setParent(parent);
        transform.setLocalPosition(originPos);
        transform.setLocalRotation(originRot);
        transform.setLocalScale(originScale);
        //reset touch values
        totalTouch = 0;
        //start touch
        lastTouchPos = touchStartEvent.getTouchPosition();
        print("shoot started");
    }
}

function moveTouch() {
    var nextTouchPos = touchMoveEvent.getTouchPosition();
    totalTouch -= (lastTouchPos.y - nextTouchPos.y)*100;
    lastTouchPos = nextTouchPos;
    
    outForce = 2*Math.log(2*totalTouch);
    
    forward = transform.getInvertedWorldTransform().multiplyDirection(transform.back.normalize());
    var newPos = originPos.add(forward.uniformScale(-outForce));

    transform.setLocalPosition(newPos);
}

function endTouch() {
    if (!shooting) {
        //if reset arrow
        if (outForce <2 ) {
        	endShoot();
        }//if shoot out
        else if (outForce >=2) {
        	print("force: "+outForce.toString());
            
            newPosW = transform.getWorldPosition();
            newRotW = transform.getWorldRotation();

            var camera = script.getSceneObject().getParent().getParent().getTransform();
            var camRot = camera.getWorldRotation();

            script.getSceneObject().setParent(null);

            transform.setWorldPosition(newPosW);
            transform.setWorldRotation(newRotW);

            forwardW = transform.back.normalize();
            curTime = new Date().getTime();
            totalTime = 0;

            frontPosW = script.front.getTransform().getWorldPosition();
			endPosW = script.end.getTransform().getWorldPosition();

            shooting = true;
            script.detect.api.UpdateShooting(true);
            print("Shoot fired");
        }
    }
}

function shootingFunction() {
    if (shooting) {
        //if hit ground
        if(script.front.getTransform().getWorldPosition().y <= 0 ){
            script.text.api.miss();
            endShoot();
            return;
        }

        var rot = transform.getWorldRotation();
        var pos = newPosW;
        var launchAngle = script.pivotData.getTransform().back.angleTo(forwardW);
        var vel = forwardW.uniformScale(outForce*4); //forwardW velocity

        nextTime = new Date().getTime();
        var elapsed = (nextTime-curTime)/1000;
        totalTime += elapsed;

        if (!arrowLeaveBowCheck){ //no gravity (instantaneous calculation, add to world position)
        	vt = vel.uniformScale(elapsed);
        	newPosW = newPosW.add(vt);
        	pos = newPosW;
        	totalTime = 0;
        } 
        else { //with gravity (recalculate world position)

        	var acc = new vec3(0,-1*gravity,0);

        	//get next position
        	var vt = vel.uniformScale(totalTime);
        	var at2 = acc.uniformScale(0.5*totalTime*totalTime);
        	pos = newPosW.add(vt).add(at2);

        	//get next angle
        	var totalT = 2*vel.length*Math.sin(launchAngle)/gravity;
        	var halfT = totalT/2;
        	var x = totalTime/halfT;
        	var y = -(x*x)+2*x;
        	var newAngle = (x<1) ? launchAngle-y*launchAngle : -(launchAngle-y*launchAngle); //-ve angle
        	newAngle = (newAngle < -Math.PI/2) ? -Math.PI/2:newAngle; //clamp
        	var newRotV = rot.toEulerAngles();
        	newRotV.x = newAngle;
        	rot = quat.fromEulerVec(newRotV);
        }

		transform.setWorldRotation(rot);
        transform.setWorldPosition(pos);
    }
}

function endShoot() {
    shooting = false;
    script.detect.api.UpdateShooting(false);
    decay = 0;
    outForce = 0;
    print("Shoot ended");
}

script.api.intersect = function(hitObj,hitPos,hitRot) {
	intersected = true;
	//change parent to hit object
    var worldScale = transform.getWorldScale();
    script.getSceneObject().setParent(hitObj);
    transform.setWorldPosition(hitPos);
    transform.setWorldRotation(hitRot);
    transform.setWorldScale(worldScale);
	endShoot();
}

function arrowLeaveBowCheck(){
	var curEndPos = script.end.getTransform().getWorldPosition();
	var leave = false;

	if (endPosW.z < frontPosW.z) {leave = (curEndPos.z > frontPosW.z) ? true:false;}
	else {leave = (curEndPos.z < frontPosW.z) ? true:false;}
	if (leave && endPosW.x < frontPosW.x) {leave = (curEndPos.x > frontPosW.x) ? true:false;}
	else {leave = (curEndPos.x < frontPosW.x) ? true:false;}
	return leave;
}

var touchStartEvent = script.createEvent("TouchStartEvent");
touchStartEvent.bind(startTouch);

var touchMoveEvent = script.createEvent("TouchMoveEvent");
touchMoveEvent.bind(moveTouch);

var touchEndEvent = script.createEvent("TouchEndEvent");
touchEndEvent.bind(endTouch);

var shootingEvent = script.createEvent("UpdateEvent");
shootingEvent.bind(shootingFunction);
