// Declare top level variables
var camera, scene, renderer, container, controls;

init();
animate();



// Initialize THREE.js objects
function init() {
    
    // Create element to hold the window
    container = document.createElement( 'div' );
    document.body.appendChild( container );
    
    // Initialize the camera, scene, and renderer
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000 );
    camera.position.z = 500;
    
    scene = new THREE.Scene();
    
    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xf0f0f0 );
    document.body.appendChild( renderer.domElement );
    
    // Setup camera controls
    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);
    
    // Create particles
    for (var i = 0; i < 100; i++) {
        
        // Create material and give it a random color and additive blending
        var sphereMaterial = new THREE.SpriteMaterial( {
            color: Math.random() * 0x808008 + 0x808080,
            blending: THREE.Subtractivelending
        });
        
        // Create particle with random location
        var sphere = new THREE.Sprite(sphereMaterial);
        
        sphere.position.x = Math.random() * 1000 - 500;
        sphere.position.y = Math.random() * 1000 - 500;
        sphere.position.z = Math.random() * 1000 - 500;
        sphere.scale.set( 64, 64, 1 );
        
        // Add the particle to the scene
        scene.add( sphere );
    }
}

// Render the scene
function render() {
    renderer.render(scene, camera);
}

// Amimate the scene
function animate() {
    render();
    requestAnimationFrame(animate);
    controls.update();
}