var camera, scene, renderer, container, controls;
var light1, dirLight;
var tick = 0;
var cubes = [];
var pointLights = [];
var clock = new THREE.Clock();

initVisualizer();


function initVisualizer() {

    // Create element to hold the window
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    
    // Initialize the camera, scene, and renderer
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 500;
    
    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer( {alpha: true });
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0x000000 );
    document.body.appendChild( renderer.domElement );
    
    // Setup camera controls 
    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);

    // Add direcitonal light to scene
    dirLight = pointLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
	dirLight.position.set( 0, -1, 0 ).normalize();
	scene.add( dirLight );
	dirLight.color.setHSL( 0.1, 0.7, 0.5 );

	// Add point lights to scene
	addPointLights(3);

    // Create cubes
    createCubes(100);

    // Setup camera controls 
    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);
    animate();
}


// Add point light to scene at random location and color 
function addPointLights(numLights) {

	for (var i = 0; i < numLights; i++) {
		var light = new THREE.PointLight( Math.random() * 0x808008 + 0x808080, 2, 400 );

		light.position.x = Math.random() * 500 - 250;
		light.position.y = Math.random() * 500 - 250;
		light.position.z = Math.random() * 500 - 250;

		pointLights.push(light);
		scene.add(light);
	}
}


// Create numCubes cubes and give them random colors and locations
function createCubes(numCubes) {

	var cube = new THREE.BoxGeometry(20, 20, 20);
	var material = new THREE.MeshPhongMaterial( { color: 0xffffff, specular: 0xffffff, shininess: 50 } );

	for (var i = 0; i < numCubes; i++) {

		var cubeMesh = new THREE.Mesh( cube, material );
		cubeMesh.position.x = Math.random() * 1000 - 500;
		cubeMesh.position.y = Math.random() * 1000 - 500;
		cubeMesh.position.z = Math.random() * 1000 - 500;

		cubeMesh.rotation.x = Math.random() * 2 * Math.PI;
		cubeMesh.rotation.y = Math.random() * 2 * Math.PI;

		cubes.push(cubeMesh);
		scene.add(cubeMesh);
	}
}


// Make point lights move in circular pattern
function animatePointLights() {

    // Get the amount of time that has passed
    var delta_t = clock.getDelta();
    tick += delta_t;
    
    // Check for wraparound (we want tick to stay positive)
    if (tick < 0) t = 0;

    if (delta_t > 0) {

    	for (var i = 0; i < pointLights.length; i++) {
	        var radius = Math.abs(10 - tick*i % 20);
	        var light = pointLights[i];
        
		    // Update point light position
		    light.position.x = radius * Math.cos(tick) * 50;
			light.position.y = radius * Math.sin(tick) * 50;
		    light.position.z = radius * Math.cos(tick) * 50;
    	}
    }
}


function render() {
 	renderer.render( scene, camera );
}


function animate() {

	requestAnimationFrame(animate);

	animateCubes();
	animatePointLights();
	controls.update();
	render();
}


// Adjust scene accordingly when window is resized by user
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}


// Controls rotation and location of cubes
function animateCubes() {

	var timer = Date.now() * 0.0001;

	for (var i = 0; i < cubes.length; i++) {
		var cube = cubes[i];

		if (cube.position.y < -500) {
			cube.position.y = 500;
		} else {
			cube.position.y--;
		}

		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
	}
}