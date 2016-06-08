var camera, scene, renderer, container, stats;
var postprocessing = { enabled : true }
var bgColor = new THREE.Color(0x2929a3);


initGodrayVisualizer();
animate();


// Basic Three.js scene setup
function initGodrayVisualizer() {

	// Create a container for the scene and add it to the document body
	container = document.createElement('div');
	document.body.appendChild(container);

	// Initialize the camera
	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 3000 );
	camera.position.z = 200;

	// Initialize the scene
	scene = new THREE.Scene();

	// Create the sphere geometry and add it to scene
	var sphereMaterial = new THREE.MeshBasicMaterial( { color: 0x000000, shading: THREE.FlatShading } );
	var sphere = new THREE.SphereGeometry( 1, 20, 10 );
	var sphereScale = 20;

	sphereMesh = new THREE.Mesh( sphere, sphereMaterial );
	sphereMesh.scale.set( sphereScale, sphereScale, sphereScale );
	scene.add( sphereMesh );

	// Initialize renderer and add it the scene
	renderer = new THREE.WebGLRenderer( { antialias: false } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );
	renderer.autoClear = false;
	renderer.setClearColor(0xff0000);

	// Add stats
	stats = new Stats();
	container.appendChild( stats.domElement );
}


// Create godrays effects
function initPostprocessing() {

}


function animate() {
	requestAnimationFrame(animate, renderer.domElement);
	render();
	stats.update();
}


function render() {
	renderer.clear();
	renderer.render(scene, camera);
}