var camera, scene, renderer, container, controls, stats, spheres = [];
var light1, dirLight;
var tick = 0;
var clock = new THREE.Clock();
var boxes = [];
var numBoxes = 50;
var numSpheres = 2;

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

    initSpheres();
    initBoxes();

    animate();
}


function initSpheres() {
	for (var i = 0; i < numSpheres; i++) {
		var geometry = new THREE.SphereGeometry( 100, 100, 100 );
		var material = new THREE.MeshBasicMaterial( {color: 0x000000 } );
		sphere = new THREE.Mesh( geometry, material );
		sphere.geometry.dynamic = true;
		sphere.position.set( (i - spheres.length / 2) * 1000, 0, 0 );

		spheres.push( sphere );
		scene.add( sphere );
	}
}


function initBoxes() {
	for (var i = 0; i < numBoxes; i++) {
		var meshColor = new THREE.Color( Math.sin( i / numBoxes + Math.PI * 0.33 ), Math.sin( i / numBoxes + Math.PI * 0.66 ), Math.sin( i / numBoxes ) );
		var geometry = new THREE.BoxGeometry( 10, 10, 10);
		var material = new THREE.MeshBasicMaterial( {color: meshColor });
		var box = new THREE.Mesh( geometry, material );
		box.geometry.dynamic = true;
		box.position.x = i * 100 - numBoxes * 100 / 2;

		boxes.push( box );
		scene.add( box );
	}
}


function sphereNeedsUpdate( index ) {
	spheres[ index ].geometry.verticesNeedUpdate = true;
	spheres[ index ].geometry.elementsNeedUpdate = true;
	spheres[ index ].geometry.morphTargetsNeedUpdate = true;
	spheres[ index ].geometry.uvsNeedUpdate = true;
	spheres[ index ].geometry.normalsNeedUpdate = true;
	spheres[ index ].geometry.colorsNeedUpdate = true;
	spheres[ index ].geometry.tangentsNeedUpdate = true;
}


function scaleSphere( sphereIndex, scaleFactor) {
	spheres[ sphereIndex ].scale.set( scaleFactor, scaleFactor, scaleFactor );
	sphereNeedsUpdate( sphereIndex );
}


function animateBoxes() {
	for (var i = 0; i < boxes.length; i++) {
		boxes[i].geometry.vertices[0].y = boxes[i].geometry.vertices[1].y = boxes[i].geometry.vertices[4].y = boxes[i].geometry.vertices[5].y = getFrequencyValue(i / boxes.length * 20000) * 5;
		boxes[i].geometry.vertices[2].y = boxes[i].geometry.vertices[3].y = boxes[i].geometry.vertices[6].y = boxes[i].geometry.vertices[7].y = -getFrequencyValue(i / boxes.length * 20000) * 5;

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
		detectBeats();
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


// Checks for kicks or snares in audio playback and scales corresponding meshes accordingly
function detectBeats( ) {

	if (getFrequencyValue( 20 ) > 150) {
		scaleSphere( 0, 2 );
	} else {
		scaleSphere( 0, 1 );
	}

	if (getFrequencyValue( 12000 ) > 90 ) {
		scaleSphere( 1, 2);
	} else {
		scaleSphere( 1, 1);
	}

	for ( var i = 0; i < spheres.length; i++) {
		sphereNeedsUpdate( i );
	}

}