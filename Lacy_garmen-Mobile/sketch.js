let font;
let fSize; // font size
let msg; // text to write
let pts = []; // store path data
let translateAmount = 40; // variable to control translation amount
let permissionGranted = false; // Flag to check if permission is granted

function preload() {
    // preload OTF font file
    font = loadFont('Lacy_garmen-Mobile/Arial Bold.ttf');
}

function setup() {
    createCanvas(1000, 1000);
    
    // Check if permission is needed
    if (
        typeof DeviceMotionEvent !== 'undefined' &&
        typeof DeviceMotionEvent.requestPermission === 'function'
    ) {
        // iOS 13+ devices
        let permissionButton = createButton('Allow Motion Access');
        permissionButton.style('font-size', '24px');
        permissionButton.position(width / 2 - 100, height / 2 - 20);
        permissionButton.mousePressed(requestMotionPermission);
    } else {
        // Non iOS 13+ devices
        permissionGranted = true;
    }
    
    fSize = 256;
    textFont(font);
    textSize(fSize);
    msg = 'Zaum';
    pts = font.textToPoints(msg, 0, 0, fSize, {
        sampleFactor: 0.1, // increase for more points
        simplifyThreshold: 0.0 // increase to remove collinear points
    });

    // Calculate the bounding box of the points to center them
    let bounds = font.textBounds(msg, 0, 0, fSize);
    
    // Translate points to center based on the bounding box
    let centerX = (width - bounds.w) / 2 - bounds.x;
    let centerY = (height - bounds.h) / 2 - bounds.y;

    for (let i = 0; i < pts.length; i++) {
        pts[i].x += centerX;
        pts[i].y += centerY;
    }

    stroke(255);
    strokeWeight(10);
    noFill();
}

function draw() {
    if (!permissionGranted) {
        background(220);
        textAlign(CENTER, CENTER);
        textSize(32);
        fill(0);
        text('Please allow motion access', width / 2, height / 2 - 60);
        noLoop(); // Stop looping until permission is granted
        return;
    }
    
    background(255);
    blendMode(DIFFERENCE);
    
    // Use device rotation data instead of mouseX and mouseY
    // Map rotationX to 'd' (distance)
    const maxTilt = 30; // Maximum tilt angle in degrees to consider
    const constrainedRotationX = constrain(rotationX, -maxTilt, maxTilt);
    const d = map(constrainedRotationX, -maxTilt, maxTilt, 0, width / 2);

    // Use rotationY for 'angle', convert degrees to radians
    const angle = radians(rotationY);

    push();
    translate(width / 2, height / 2); // Adjust to screen center

    for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        push();
        translate(p.x - width / 2, p.y - height / 2);
        rotate(angle);
        line(
            -d * translateAmount / 100,
            -d * translateAmount / 100,
            +d * translateAmount / 100,
            +d * translateAmount / 100
        );
        pop();
    }

    pop();
    blendMode(BLEND);
}

// Function to request motion permission on iOS devices
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
                    // Remove the permission button
                    this.remove();
                    loop(); // Start the draw loop
                } else {
                    console.log('Motion permission denied');
                }
            })
            .catch(console.error);
    } else {
        // For browsers that don't require permission (e.g., Android devices)
        permissionGranted = true;
        loop(); // Start the draw loop
    }
}
