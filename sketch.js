let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let translateAmount = 40; // variable to control translation amount
let permissionGranted = false; // Flag to check if permission is granted
let permissionButton; // Variable to reference the permission button

function preload() {
    // preload OTF font file
    font = loadFont('/Arial Bold.ttf');
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(220);

    // Reference the button from HTML
    permissionButton = select('#motionPermissionButton');
    permissionButton.position(windowWidth / 2 - 100, windowHeight / 2 - 20);
    permissionButton.mousePressed(requestMotionPermission);
    permissionButton.touchStarted(requestMotionPermission);
    permissionButton.style('z-index', '1000');

    // Check if permission is needed
    if (
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
        // iOS 13+ devices
        noLoop(); // Stop the draw loop until permission is granted
    } else {
        // Non iOS 13+ devices
        permissionGranted = true;
        permissionButton.hide();
    }

    // Rest of your setup code...
}

function draw() {
    if (!permissionGranted) {
        fill(0);
        textSize(16);
        textAlign(CENTER, CENTER);
        text('Please allow motion access', width / 2, height / 2 - 60);
        return;
    }

    // Your existing draw code...
}

function requestMotionPermission() {
    if (
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
        DeviceMotionEvent.requestPermission()
            .then(response => {
                if (response === 'granted') {
                    permissionGranted = true;
                    console.log('Motion permission granted');
                    permissionButton.hide();
                    loop(); // Resume the draw loop
                } else {
                    console.log('Motion permission denied');
                }
            })
            .catch(console.error);
    } else {
        // For browsers that don't require permission
        permissionGranted = true;
        permissionButton.hide();
        loop(); // Resume the draw loop
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
