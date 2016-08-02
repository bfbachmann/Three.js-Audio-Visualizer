var camera, scene, renderer, container, controls, stats, sphere;
var light1, dirLight;
var tick = 0;
var clock = new THREE.Clock();
var boxes = [];
var numBoxes = 50;


initVisualizer();


function initVisualizer() {

    // Create element to hold the window
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    
    // Initialize the camera, scene, and renderer
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 900;
    
    scene = new THREE.Scene();
    
    renderer = new THREE.WebGLRenderer( {alpha: true });
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0xf0f0f0 );
    document.body.appendChild( renderer.domElement );

    //Show stats
    stats = new Stats();
    document.body.appendChild(stats.domElement);
    
    // Setup camera controls 
    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);

    // Add direcitonal light to scene
    dirLight = pointLight = new THREE.DirectionalLight( 0xffffff, 0.2 );
	dirLight.position.set( 0, -1, 0 ).normalize();
	scene.add( dirLight );
	dirLight.color.setHSL( 0.1, 0.7, 0.5 );

    // Setup camera controls 
    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);

    // initSphere();
    initBoxes();

    animate();
}


function initSphere() {
	var geometry = new THREE.SphereGeometry( 5, 32, 32 );
	var material = new THREE.MeshBasicMaterial( {color: 0x000000} );
	sphere = new THREE.Mesh( geometry, material );
	sphere.geometry.dynamic = true;

	scene.add( sphere );
}


function initBoxes() {
	for (var i = 0; i < numBoxes; i++) {
		var geometry = new THREE.BoxGeometry( 10, 10, 10);
		var material = new THREE.MeshBasicMaterial( {color: 0x0105ff });
		var box = new THREE.Mesh( geometry, material );
		box.geometry.dynamic = true;
		box.position.x = i * 100 - numBoxes * 100 / 2;

		boxes.push(box);
		scene.add( box );
	}
}


function animateSphere() {
	for (var i = 0; i < sphere.geometry.faces.count; i++) {
		sphere.geometry.faces[i].y = getFrequencyValue(i / sphere.geometry.faces.count * 20000);
	}


	sphere.geometry.vertices[0].y = sphere.geometry.vertices[1].y = sphere.geometry.vertices[2].y = getFrequencyValue(100);
	sphere.geometry.verticesNeedUpdate = true;
	sphere.geometry.elementsNeedUpdate = true;
	sphere.geometry.morphTargetsNeedUpdate = true;
	sphere.geometry.uvsNeedUpdate = true;
	sphere.geometry.normalsNeedUpdate = true;
	sphere.geometry.colorsNeedUpdate = true;
	sphere.geometry.tangentsNeedUpdate = true;
	console.log(sphere.geometry.vertices[0].y);
}

function animateBoxes() {
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].geometry.vertices[0].y = boxes[i].geometry.vertices[1].y = boxes[i].geometry.vertices[4].y = boxes[i].geometry.vertices[5].y = getFrequencyValue(i / boxes.length * 20000) * 5;

		boxes[i].geometry.verticesNeedUpdate = true;
		boxes[i].geometry.elementsNeedUpdate = true;
		boxes[i].geometry.morphTargetsNeedUpdate = true;
		boxes[i].geometry.uvsNeedUpdate = true;
		boxes[i].geometry.normalsNeedUpdate = true;
		boxes[i].geometry.colorsNeedUpdate = true;
		boxes[i].geometry.tangentsNeedUpdate = true;
	}
}


function render() {
	renderer.render( scene, camera );
}


function animate() {

    stats.begin();

	if (isPlaying()) {
		// animateSphere();
		animateBoxes();
	}

	controls.update();
	render();

	stats.end();

	requestAnimationFrame(animate);
}


// Adjust scene accordingly when window is resized by user
function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}