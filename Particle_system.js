var container, camera, scene, particleSystem, renderer, light1;
var tick = 0;
var clock = new THREE.Clock();
var DEBUG = true;
var oldX, oldY;
var currentX, currentY;

oldY = oldX = NaN;

init();
animate();

function init() {
    
    // Create container for display and add to document body        
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // Initialize camera
    camera = new THREE.PerspectiveCamera(28, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 100;
    
    // Initialize scene
    scene = new THREE.Scene();
    
    // Add point lights to the scene
    // light1 = new THREE.AmbientLight(0x00020);
    // scene.add(light1);
    
    // Create particle system and add it to the scene
    particleSystem = new THREE.GPUParticleSystem(
        { 
            maxParticles: 500000   
        }
    );
    scene.add(particleSystem);
    
    // Debugging
    if (DEBUG) console.log('particle system created with max particles: ' + particleSystem.maxParticles);
    
    // Initialize the renderer
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);
    
    // Debugging
    if (DEBUG) console.log('renderer created');
    
    // Set up function to be called automatically when window is resized
    window.addEventListener('resize', onWindowResize, false);
    
    // Setup particle spawning options and parameters (options passed during each particle spawn)
    options = {
        position: new THREE.Vector3(),
        positionRandomness: .1,
        velocity: new THREE.Vector3(),
        velocityRandomness: 0.9,
        color: 0xaa88ff,
        colorRandomness: 0,
        turbulence: 0.5,
        lifetime: 2,
        size: 5,
        sizeRandomness: 1
    };
    
    spawnerOptions = {
        spawnRate: 50000,
        horizontalSpeed: 1.2,
        verticalSpeed: 1,
        timeScale: 1
    }
}


// Correct display when screen is resized (called implicitly by THREE.js framework) 
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


// Animate the scene
function animate() {
    requestAnimationFrame(animate);
    
    // Get the amount of time that has passed
    var delta_t = clock.getDelta() * spawnerOptions.timeScale;
    tick += delta_t;
    
    // Check for wraparound (we want tick to stay positive)
    if (tick < 0) t = 0;
    
    // Update particle color
    options.color = Math.sin(tick) * 0x808008 + 0x808080;
        
    spawnParticles(delta_t, tick);
    particleSystem.update(tick);
    render();
}


// Update the partcile system by passing it spawning options
function spawnParticles(delta_t, tick) {
    if (delta_t > 0) {
        var radius = Math.abs(10 - tick % 20);

        if (oldX != NaN) {
            oldX = currentX;
            oldY = currentY;
        }
        
        options.position.x = radius * Math.cos(tick * spawnerOptions.horizontalSpeed) * 4;
        options.position.y = radius * Math.sin(tick * spawnerOptions.verticalSpeed) * 3;
        options.position.z = Math.cos(tick * spawnerOptions.horizontalSpeed + spawnerOptions.verticalSpeed) * 5;

        currentX = options.position.x;
        currentY = options.position.y;

        if (Math.sqrt(Math.pow(currentX - oldX, 2) + Math.pow(currentY - oldY, 2)) > 0.8) {
            explosion();
        }

        console.log(Math.sqrt(Math.pow(currentX - oldX, 2) + Math.pow(currentY - oldY, 2)));
        
        for (var x = 0; x < spawnerOptions.spawnRate * delta_t; x++) {
            // Note: once the particles have been spawned their behavour is controlled completely by the GPU
            particleSystem.spawnParticle(options);
        }
        
        // Update point light position
        // light1.position = options.position;
    }
}


// Render the scene
function render() {
    renderer.render(scene, camera);
} 


// Reverse time scale when mouse over 'welcome' text
function rewind() {
    spawnerOptions.timeScale = -1;
}

// Set time scale back to 1 when mouse leaves 'welcome' text
function play() {
    spawnerOptions.timeScale = 1;
}


// Spawn particles at location of the 'welcome' text when the mouse hovers over it
function welcomeBurst() {

    var delta_t = clock.getDelta() * spawnerOptions.timeScale;
    
    if (delta_t > 0) {
        
        options.position.x = 0;
        options.position.y = 0;
        options.position.z = 0;
        
        for (var x = 0; x < 10000; x++) {
            // Note: once the particles have been spawned their behavour is controlled completely by the GPU
            particleSystem.spawnParticle(options);
        }
    }
}


// Create quick explosion of particles at the current spawner position
function explosion() {

    options.horizontalSpeed *= 3;
    options.verticalSpeed *= 3;

    var delta_t = clock.getDelta() * spawnerOptions.timeScale;
    var vr = options.velocityRandomness;
    options.velocityRandomness = 100;
    
    if (delta_t > 0) {        
        for (var x = 0; x < 1000; x++) {
            // Note: once the particles have been spawned their behavour is controlled completely by the GPU
            particleSystem.spawnParticle(options);
        }
    }

    options.velocityRandomness = vr;
}


