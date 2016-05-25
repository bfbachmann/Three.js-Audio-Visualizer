var camera, scene, renderer, container, controls;
var light1, dirLight;
var tick = 0;
var cubes = [];
var pointLights = [];
var clock = new THREE.Clock();
var colors = [
        '#00ffff', '#0000ff', '#ff00ff',
        '#008000', '#00ff00', '#800000',
        '#000080', '#808000', '#800080', 'ff0000',
        '#c0c0c0', '#008080', '#ffff00'
    ];


initVisualizer();


function initVisualizer() {

    // Create element to hold the window
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    
    // Initialize the camera, scene, and renderer
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 700;
    
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
	addPointLights(10);

    // Create cubes
    createCubes(1000);

    // Setup camera controls 
    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);
    animate();
}


// Add point lights to scene with varying colors in circular pattern around center 
function addPointLights(numLights) {

	var radius = 400;

	for (var i = 0; i < numLights; i++) {

		var light = new THREE.PointLight(colors[i], 2, 350 );

		light.position.x = radius * Math.cos(i / numLights * 2 * Math.PI);
		light.position.y = radius * Math.sin(i / numLights * 2 * Math.PI);
		light.position.z = 0;

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
		cubeMesh.position.x = Math.random() * 2000 - 1000;
		cubeMesh.position.y = Math.random() * 1500 - 750;
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
	        var light = pointLights[i];
        
		    // Update point light position
		 //    light.position.x = radius * Math.sin(tick + 3 * i);
			// light.position.y = radius * Math.cos(tick + i);
		 //    light.position.z = radius * Math.sin(tick + 2 * i);


		    var volume = getFrequencyValue((i * 20000 / pointLights.length) + 1);
		    light.intensity =  Math.pow((volume/ 256), 3) * 40;

    	}
    }
}


function render() {
 	renderer.render( scene, camera );
}


function animate() {

	requestAnimationFrame(animate);

	if (isPlaying()) {
		animateCubes();
		animatePointLights();
	}

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

		if (cube.position.z > 500) {
			cube.position.z = -500;
		} else {
			cube.position.z++;
		}

		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
	}
}