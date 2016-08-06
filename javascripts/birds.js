var scene, camera, renderer;
var clock = new THREE.clock();
var loader, flight;
var width = window.innerWidth, height = window.innerHeight;

function init() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(65, width/height, 0.1, 1000);
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(width, height);
	// i didnt set the clear color because i want the backroung to be transparent
	document.body.appendChild(renderer.domElement);

	loader = new Three.JSONLoader();
	loader.load('Assets/bird.js', addModel);
}

function animate() {

}

function addModel(geomerty, materials) {
	materials.forEach( function (material) { material.skinning = true; } );
}