// -----JS CODE-----
//@input SceneObject bullseye
//@input SceneObject hit
//@input SceneObject miss

var prev = script.bullseye;

var aligner;
var animating = false;

var maxTime = 600;
var maxWidth;
var height;
var gradient;
var startTime;

function start(){
	script.api.disable();
}

function enable(name) {
	switch(name) {
		case "bullseye":
			prev.enabled = false;
			script.bullseye.enabled = true;
			prev = script.bullseye;
			break;
		case "hit":
			prev.enabled = false;
			script.hit.enabled = true;
			prev = script.hit;
			break;
		case "miss":
			prev.enabled = false;
			script.miss.enabled = true;
			prev = script.miss;
			break;
	}
	aligner = prev.getComponentByIndex("",1);
	startAnimation();
}

function startAnimation() {
	maxWidth = aligner.size.x;
	height = aligner.size.y;
	gradient = maxWidth/maxTime;

	aligner.size = new vec2(0,height);
	startTime = new Date().getTime();
	animating = true;
}

function runAnimation() {
	if (!animating) return;
	var elapsed = new Date().getTime() - startTime;

	//newWidth = gradient*elapsed;
	newWidth = (elapsed <= maxTime) ? gradient*elapsed : maxWidth;
	aligner.size = new vec2(newWidth,height);
	if (newWidth >= maxWidth) animating = false;
}

var animateEvent = script.createEvent("UpdateEvent");
animateEvent.bind(runAnimation);

script.api.disable = function() {
	animating = false;
	script.bullseye.enabled = false;
	script.hit.enabled = false;
	script.miss.enabled = false;
}

script.api.hit = function(radius){
	if (radius < 0.2) {
		enable("bullseye");
	} else {
		enable("hit");
	}
}

script.api.miss = function(){
	enable("miss");
}