var camera;
var controls;
var scene;
var light;
var renderer;
var scene2;
var renderer2;
var div;
var spheres = [];
var clock = new THREE.Clock();
var tick = 0;

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
    renderer.setClearColor(0xffffff, 1)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.zIndex = 5;
    document.body.appendChild(renderer.domElement);
    
    //CSS3D Scene
    scene2 = new THREE.Scene();
    
    //HTML
    element = document.createElement('div');
    element.innerHTML = 'Plain text inside a div.';
    element.className = 'three-div';
    
    //CSS Object
    div = new THREE.CSS3DObject(element);
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

    createSpheres(10);
}


function animate() {
    requestAnimationFrame(animate);
    renderer2.render(scene2, camera);
    renderer.render(scene, camera);
    controls.update();
    updateSpheres();
}


function createSpheres(numSpheres) {
	for (var i = 0; i < numSpheres; i++) {
		var material = new THREE.MeshBasicMaterial({color: new THREE.Color(Math.random(), Math.random(), Math.random())});
		var geometry = new THREE.SphereGeometry(Math.random() * 40 + 20, 32, 32);
		var sphere = new THREE.Mesh(geometry, material);

		sphere.position.set(Math.random() * 800 - 400, Math.random() * 800 - 400, Math.random() * 800 - 400);
		sphere.radius = sphere.position.length();

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

			sphere.position.x = sphere.radius * Math.sin(tick + 3 * i);
			sphere.position.y = sphere.radius * Math.cos(tick + i);
			sphere.position.z = sphere.radius * Math.sin(tick + 2 * i);
		}
    }
}



