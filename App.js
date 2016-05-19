// Declare top level variables
var camera, scene, renderer, container, controls;
var spheres = [];

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
    renderer.setSize( window.innerWidth, window.innerHeight);
    renderer.setClearColor( 0xf0f0f0 );
    document.body.appendChild( renderer.domElement );
    
    // Setup camera controls 
    controls = new THREE.TrackballControls(camera);
    controls.addEventListener('change', render);
    
    // Create particles
    createSprites(100);
    createSpheres(50);
    initModel();
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
    if (spheres.length > 0) {
        sphereControl();
    }
}



function createSprites(numSprites) {
    for (var i = 0; i < numSprites; i++) {
        // Create material and give it a random color and additive blending
        var spriteMaterial = new THREE.SpriteMaterial( {
            color: Math.random() * 0x808008 + 0x808080
        });
        
        // Create particle with random location
        var sprite = new THREE.Sprite(spriteMaterial);
        
        sprite.position.x = Math.random() * 1000 - 500;
        sprite.position.y = Math.random() * 1000 - 500;
        sprite.position.z = Math.random() * 1000 - 500;
        sprite.scale.set( 64, 64, 1 );
        
        // Add the particle to the scene
        scene.add(sprite);
    }
}



function createSpheres(numSpheres) {
    
    for (var i = 0; i < numSpheres; i++) {
        var geometry = new THREE.SphereGeometry( 20, 10, 10 );
        var material = new THREE.MeshBasicMaterial( {color: Math.random() * 0x808008 + 0x808080} );
        var sphere = new THREE.Mesh( geometry, material );
                
        sphere.position.x = Math.random() * 1000 - 500;
        sphere.position.y = Math.random() * 1000 - 500;
        sphere.position.z = Math.random() * 1000 - 500;
        
        // Add the particle to the scene
        spheres.push(sphere);
        scene.add(sphere);
    }
}


// Controls the movement of the spheres in the scene
function sphereControl() {
    var length = spheres.length;
    
    for (var i = 0; i < length; i++) {
        var sphere = spheres[i];
        var location = new THREE.Vector3(sphere.position.x, sphere.position.y, sphere.position.z);
        
        console.log(sphere.position.x + ' , ' + sphere.position.y + ' , ' + sphere.position.z);
        
        if (sphere.position.z > 500) {
            sphere.position.z = -500;
            sphere.position.x = Math.random() * 1000 - 500;
            sphere.position.y = Math.random() * 1000 - 500;
        } else {
            sphere.position.z += 10;
        }  
    }
}

// Loads 3D character model into scene form JSON file
function initModel() {
    var modelMaterial = new THREE.MeshBasicMaterial({
        color: 0x802080        
    });
    var loader = new THREE.JSONLoader();
    
    loader.load("Assets/character.js",  function(geometry) {
        var mesh = new THREE.Mesh(geometry, modelMaterial);
        scene.add(mesh);
    });
}