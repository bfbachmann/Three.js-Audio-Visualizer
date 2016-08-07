var camera;
var controls;
var scene;
var light;
var renderer;
var scene2;
var renderer2;
var spheres = [];
var clock = new THREE.Clock();
var tick = 0;
var raycaster;
var mouse;

init();
animate();

function init() {

    //camera
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 0, -1000);
    
    //controls
    controls = new THREE.TrackballControls(camera);
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    
    //Scene
    scene = new THREE.Scene();
    
    //HemisphereLight
    light = new THREE.HemisphereLight(0xffbf67, 0x15c6ff);
    scene.add(light);
    
    //WebGL Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setClearColor(0xffffff, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.zIndex = 5;
    document.body.appendChild(renderer.domElement);
    
    //CSS3D Scene
    scene2 = new THREE.Scene();
    
    //HTML
    var element = document.createElement('div');
    element.innerHTML = 'WHATS GOOD?';
    element.className = 'three-div';
    
    //CSS Object
    var div = new THREE.CSS3DObject(element);
    div.position.x = 0;
    div.position.y = 0;
    div.position.z = -185;
    div.rotation.y = Math.PI;
    scene2.add(div);
    
    //CSS3D Renderer
    renderer2 = new THREE.CSS3DRenderer();
    renderer2.setSize(window.innerWidth, window.innerHeight);
    renderer2.domElement.style.position = 'absolute';
    renderer2.domElement.style.top = 0;
    document.body.appendChild(renderer2.domElement);

    // Init raycaster and mouse
    raycaster = new THREE.Raycaster();
	mouse = new THREE.Vector2();
	window.addEventListener( 'mousemove', onMouseMove, false );

    createSpheres(10);
}


function animate() {
    requestAnimationFrame(animate);

    controls.update();
    updateSpheres();
    render();
}


function render() {
	// update the picking ray with the camera and mouse position	
	raycaster.setFromCamera( mouse, camera );

	// calculate objects intersecting the picking ray
	var intersects = raycaster.intersectObjects( scene.children );

	if (intersects.length > 0) {
		if (intersects[0].object.positionLocked === false) {
			intersects[0].object.material.color.set( 0xff0000 );
			intersects[0].object.positionLocked = true;
			intersects[0].object.infobox = addInfobox(intersects[0].object.position, 'infobox test');
		}
	}

	renderer2.render(scene2, camera);
    renderer.render(scene, camera);
}


function createSpheres(numSpheres) {
	for (var i = 0; i < numSpheres; i++) {
		var color = new THREE.Color(Math.random(), Math.random(), Math.random());
		var material = new THREE.MeshBasicMaterial({color: color});
		var geometry = new THREE.SphereGeometry(Math.random() * 80 + 40, 32, 32);
		var sphere = new THREE.Mesh(geometry, material);

		sphere.position.set(Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400);
		sphere.positionLocked = false;
		sphere.radius = sphere.position.length();
		sphere.originalColor = color;
		sphere.infobox = false;

		spheres.push(sphere);
		scene.add(sphere);
	}
}


function updateSpheres() {
    // Get the amount of time that has passed
    var delta_t = clock.getDelta();
    tick += delta_t;
    
    // Check for wraparound (we want tick to stay positive)
    if (tick < 0) {
		tick = 0;
    } else {
		for(var i = 0; i < spheres.length; i++) {

			var sphere = spheres[i];

			if (sphere.positionLocked === false) {

				if (sphere.infobox !== false) {
					// sphere.infobox.element.parentNode.remove(sphere.infobox.element); //TODO: FIX THIS
					scene2.remove(scene2.children[1]);
					console.log(scene2.children);
					sphere.infobox = false;
					sphere.material.color.set(sphere.originalColor);
				}

				sphere.position.x = sphere.radius * Math.sin(tick + 3 * i);
				sphere.position.y = sphere.radius * Math.cos(tick + i);
				sphere.position.z = sphere.radius * Math.sin(tick + 2 * i);
			} else {
				sphere.positionLocked = false;
			}
		}
    }
}

function onMouseMove( event ) {

	// calculate mouse position in normalized device coordinates
	// (-1 to +1) for both components

	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}


function addInfobox(position, text) {

	if (scene2.children.length < 2) {

	    //HTML
	    var element = document.createElement('div');
	    element.innerHTML = text;
	    element.className = 'three-div';
	    
	    //CSS Object
	    var infobox = new THREE.CSS3DObject(element);
	    infobox.position.set(position);
	    infobox.rotation.y = Math.PI;
	    infobox.name = 'myInfobox';

	    scene2.add(infobox);

	    return infobox;
	}
}



