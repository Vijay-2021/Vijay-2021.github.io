const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const FPSElement = document.getElementById('fps');

const model = poseDetection.SupportedModels.BlazePose;
const line_width = 1
const score_threshold = 0.5
const default_radius = 2

var updateFPS = false

var sentResizedMessage = false;

const intervalId = window.setInterval(function () { updateFPS = true; }, 1000); //update the current and average fps once / second

var using_normal_mediapipe = false

var landmarks = {} //use this to store our landmarks in a common format for both TFJS and Mediapipe if necessary

const mpPose = window;

const poseOptions = {
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.4.1624666670/${file}`; //https://emscripten.org/docs/porting/files/packaging_files.html
    }
};

const pose = new mpPose.Pose(poseOptions);

const htmlImageElement = new Image(canvasElement.width, canvasElement.height);

var skeleton_type = "full" //start with the generic mediapipe skeleton from their drawing utils class 

/***
 * Sets the canvas's internal size to the videoElements native size 
 */
function resizeCanvasToDisplaySize(canvas) {
    // look up the size the canvas is being displayed
    const width = canvas.width;
    const height = canvas.height;
    // If it's resolution does not match change it
    if (videoElement.width !== width || videoElement.height !== height) {
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        return true;
    }

    return false;
}

/***
 * Note: We can't access local functions from flutter or local variables. We only have access to the DOM and the Window, atleast
 * thats what it seemed like from the testing I did, thus we have to send a message to an event listener which will call the 
 * function we need instead of directly calling a function/manipulating variables
 * 
 * A custom event listener that listens for skeleton change events sent from the flutter backend. 
 */
window.addEventListener("changeSkeleton", (event) => {
    console.log(`Event: ${event}`)
    console.log(`Event Skeleton Type: ${event.detail.skeleton_type}`)
    console.log(JSON.stringify(event.detail));
    console.log(JSON.stringify(event));
    setSkeletonType(event.detail.skeleton_type)
}, false);
/***
 * This function changes the skeleton type. I'm not sure if the else statment is needed but I put it there incase there are some 
 * type issues from the flutter side. 
 */
function setSkeletonType(type) {
    if (typeof type === 'string' && type.length > 0) {
        skeleton_type = type
    }
    else {
        skeleton_type = String(type)
    }
}

/***
 * This is the function where the landmarks are drawn and the fps counter is updated
 * First draw the requested skeleton, then print the pose to console for flutter to access, then run fps update
 */
function updateScreen(results) {
    //landmarks = results; //if we need a results variable
    //drawConnectors(canvasCtx, results, POSE_CONNECTIONS,{ color: '#00FF00', lineWidth: 2.0 });
    //drawLandmarks(canvasCtx, results,{ color: '#FF0000', lineWidth: 1.0 });
    switch (skeleton_type) {
        //chose what skeleton to draw based on skeleton type

        case "full":
            drawJoints(canvasCtx, results, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: line_width }, "full");
            drawLandmarks(canvasCtx, results, { color: '#FF0000', lineWidth: line_width }, "full");
            break;
        case "lumbar":
            drawJoints(canvasCtx, results, canvasElement.width, canvasElement.height, "lumbar");
            drawConnections(canvasCtx, results, canvasElement.width, canvasElement.height, "lumbar");
            break;
        case "cervical":
            drawJoints(canvasCtx, results, canvasElement.width, canvasElement.height, "cervical");
            break;
        default:
            //draw nothing
            break;
    }
    console.log(results)
    runFPSUpdate()
}

/***
 * This is the drawing function for IOS/Mac. It seems like it needs to be async for this to run on IOS, I'm not sure if this is 
 * a configuration issue or something else
 */
async function tfjsSetLandmarks(poses) {
    canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);

    if (poses != null && poses[0] != null) {
        if (poses[0]['keypoints'] != null && poses[0]['keypoints'].length > 0) {
            await updateScreen(createAdditionalJoints(poses[0]['keypoints']))
        }
    }
    return false;
}

const estimationConfig = { flipHorizontal: true };
const timestamp = performance.now(); // I think you can use this to do internal fps calculations 

/***
 * The update loop for ios/windows/linux/mac. I have not formally tested timestamp checking with these, might be worth a try
 * for Windows/Linux we just have to send the pose the next frame, and the onResults function(which in this case, is defined as 
 * onResultsMediapipe) will run automatically. For IOS/Mac, we have to send the pose the image, but also call the handler function
 * ourselves afterwards(tfjsSetLandmarks(poses) in this case)
 */
async function updateVideo() {
    if (using_normal_mediapipe) {
        await pose.send({ image: videoElement });
    } else {
        const poses = await detector.estimatePoses(videoElement, estimationConfig, timestamp);
        tfjsSetLandmarks(poses)
    }
    window.requestAnimationFrame(updateVideo);
}


/***
 * Sets up the camera, then starts the update video loop once the onloadeddata event(aka once the video has loaded its first frame)
 * has started
 */
async function loadCamera() {
    setupCamera()
    videoElement.onloadeddata = async function () {
        updateVideo()
        if (!sentResizedMessage) {
            console.log("Message: resize video");
            sentResizedMessage = true;
        }
    }
}

/***
 * Main function of the app. Loads specific versions of the model for Windows/Linux, Android, Mac, and IoS respectively
 * IOS/Mac are the two platforms that use the flags. The flags are part of setting up the tfjs environment. IoS and Mac must use tfjs
 * (although it is slower) as tfjs allows us to toggle WEBGL_1 on, whereas windows/linux/android can use webgl2 so they all use mediapipe
 * IoS also uses float_16 textures incase float 32 operations are not supported. 
 * Both Android and Windows use the mediapipe version of the code. However, Android runs the code through the Mediapipe camera class, 
 * the reason I did this is because I found that android detected poses extremely poorly using the loop that I setup to run the 
 * video code(updateVideo) even though it was getting 9-10fps on average. I have labelled the flags I've tested for performance
 * with how much I've tested them for their necessity/impacts on peformance. 
 */
async function setupApp() {

    var WEBGL_VERSION = 2 //tested 
    var WASM_HAS_SIMD_SUPPORT = false //not quantitatively tested 
    var WASM_HAS_MULTITHREAD_SUPPORT = false //not quantitatively tested 
    var WEBGL_CPU_FORWARD = true // not tested
    var WEBGL_PACK = true //not tested 
    var WEBGL_FORCE_F16_TEXTURES = false //not quantitatively tested 
    var WEBGL_RENDER_FLOAT32_CAPABLE = true //not quantitatively tested 
    var WEBGL_FLUSH_THRESHOLD = -1 // not tested 
    var CHECK_COMPUTATION_FOR_ERRORS = false // not tested 
    //if simd support is available then enable it 
    wasmFeatureDetect.simd().then(simdSupported => {
        if (simdSupported) {
            WASM_HAS_SIMD_SUPPORT = true
        } else {
        }
    });
    //if wasm support is available then enable it 
    wasmFeatureDetect.threads().then(threadsSupported => {
        if (threadsSupported) {
            WASM_HAS_MULTITHREAD_SUPPORT = true;
        } else {
        }
    });

    switch (getOS()) {
        case 'Mac OS':
            WEBGL_VERSION = 1
            break;
        case 'Windows':
        case 'Linux':
            using_normal_mediapipe = true;
            break;
        case 'Android':
            await loadAndroid()
            return;
        default:
            WEBGL_VERSION = 1 //use the lowest possible features if no types are detected, just incase
            WEBGL_FORCE_F16_TEXTURES = true //use float 16s on mobile just incase 
            WEBGL_RENDER_FLOAT32_CAPABLE = false
            break;
    }

    var flagConfig = {
        WEBGL_VERSION: WEBGL_VERSION,
        WASM_HAS_SIMD_SUPPORT: WASM_HAS_SIMD_SUPPORT,
        WASM_HAS_MULTITHREAD_SUPPORT: WASM_HAS_MULTITHREAD_SUPPORT,
        WEBGL_CPU_FORWARD: WEBGL_CPU_FORWARD,
        WEBGL_PACK: WEBGL_PACK,
        WEBGL_FORCE_F16_TEXTURES: WEBGL_FORCE_F16_TEXTURES,
        WEBGL_RENDER_FLOAT32_CAPABLE: WEBGL_RENDER_FLOAT32_CAPABLE,
        WEBGL_FLUSH_THRESHOLD: WEBGL_FLUSH_THRESHOLD,
        CHECK_COMPUTATION_FOR_ERRORS: CHECK_COMPUTATION_FOR_ERRORS,
    }

    if (using_normal_mediapipe) {
        await loadWindows()
        loadCamera();
    } else {
        await loadIOS(flagConfig)
        loadCamera();
        skeleton_type = "lumbar"
    }
}

/***
 * Loads everything necessary to start the app, currently just setup app
 */
async function loadApp() {
    await setupApp();
}

//start the app
loadApp();