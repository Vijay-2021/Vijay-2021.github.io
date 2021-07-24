const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const FPSElement = document.getElementById('fps');


const model = poseDetection.SupportedModels.BlazePose;
const line_width = 1
const score_threshold = 0.5
const default_radius = 2
var updateFPS = false
const detectorConfig = {
  runtime: 'tfjs',
  enableSmoothing: true,
  modelType: 'full'
};

const flagConfig = {
    WEBGL_VERSION: 1,
    WASM_HAS_SIMD_SUPPORT: false,
    WASM_HAS_MULTITHREAD_SUPPORT: false,
    WEBGL_CPU_FORWARD:true,
    WEBGL_PACK: true,
    WEBGL_FORCE_F16_TEXTURES: true,
    WEBGL_RENDER_FLOAT32_CAPABLE: false,
    WEBGL_FLUSH_THRESHOLD: -1,
    CHECK_COMPUTATION_FOR_ERRORS: false,
}

const intervalId = window.setInterval(function(){updateFPS = true;console.log("yeollo")}, 1000);

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


async function setEnvFlags(flagConfig) {
    
if (flagConfig == null) {
      return;
    } else if (typeof flagConfig !== 'object') {
      throw new Error(`An object is expected, while a(n) ${typeof flagConfig} is found.`);
    } // Check the validation of flags and values.
    
    tf.env().setFlags(flagConfig);

}


function drawResults(poses) {
    drawResult(poses[0]);
}

/**
* Draw the keypoints and skeleton on the videoElement.
* @param pose A pose with keypoints to render.
*/
function drawResult(pose) {
    if (pose['keypoints'] != null) {
        drawKeypoints(pose['keypoints']);
        drawSkeleton(pose['keypoints']);
    }
    else{
        //alert("no keypoints")
    }
}

/**
* Draw the keypoints on the videoElement.
* @param keypoints A list of keypoints.
*/
function drawKeypoints(keypoints) {
    
    const keypointInd = poseDetection.util.getKeypointIndexBySide(model);
    canvasCtx.fillStyle = 'Green';
    canvasCtx.strokeStyle = 'White';
    canvasCtx.lineWidth = line_width;

    for (var i =0; i < keypoints.length;i++){
        drawKeypoint(keypoints[i])
    }
}

function drawKeypoint(keypoint) {
    // If score is null, just show the keypoint.
    const score = keypoint.score != null ? keypoint.score : 1;
    const scoreThreshold = score_threshold || 0;
    if (score >= scoreThreshold) {
        const circle = new Path2D();
        circle.arc(keypoint.x, keypoint.y, default_radius, 0, 2 * Math.PI);
        canvasCtx.fill(circle);
        canvasCtx.stroke(circle);
    }
}
/**
* Draw the skeleton of a body on the videoElement.
* @param keypoints A list of keypoints.
*/
function drawSkeleton(keypoints) {
    canvasCtx.fillStyle = 'White';
    canvasCtx.strokeStyle = 'White';
    canvasCtx.lineWidth = line_width;

    poseDetection.util.getAdjacentPairs(model).forEach(([i, j]) => {
        const kp1 = keypoints[i];
        const kp2 = keypoints[j];

        // If score is null, just show the keypoint.
        const score1 = kp1.score != null ? kp1.score : 1;
        const score2 = kp2.score != null ? kp2.score : 1;
        const scoreThreshold = score_threshold || 0;

        if (score1 >= scoreThreshold && score2 >= scoreThreshold) {
            canvasCtx.beginPath();
            canvasCtx.moveTo(kp1.x, kp1.y);
            canvasCtx.lineTo(kp2.x, kp2.y);
            canvasCtx.stroke();
        }
    });
}

async function loadModel(){  
   // await setEnvFlags();
    detector = await poseDetection.createDetector(model, detectorConfig);
    alert("model built sucessfully? ")
    //start the camera after we have loaded the model
    //camera.start()
}
const estimationConfig = {flipHorizontal: true};
const timestamp = performance.now();

   
var FPS, avgFPS, currentTime,lastTime =0;
var updateFPS = false;
var timesOnResultsRan = 0; 
var FPSTotal =0;

function updateScreen(poses){
    currentTime = performance.now();
    FPS = Math.round(1000*(1/(currentTime-lastTime)));
    timesOnResultsRan++; 
    FPSTotal += FPS; 
    avgFPS = Math.round(FPSTotal/timesOnResultsRan);
    if(updateFPS){
        FPSElement.innerHTML = "FPS: " + FPS + " Average FPS: " + avgFPS; updateFPS = false;
    }
    lastTime = currentTime;
    canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
    
    drawResults(poses)

}/** 
const camera = new Camera(videoElement, {
    
});*/



var lastFrameTime = -1;

function updateVideo(){
    //checkFrame //requestAnimationFrame makes the transition between poses alot smoother
    window.requestAnimationFrame(onFrame);
}

var onFrame = async () => {
    if(videoElement.currentTime!=lastFrameTime){
        lastFrameTime=videoElement.currentTime;

        const poses = await detector.estimatePoses(videoElement, estimationConfig, timestamp);
        updateScreen(poses)
        updateVideo()
    }else {
        updateVideo()
    }
}

async function checkFrame(){
    if(videoElement.currentTime!=lastFrameTime){
        lastFrameTime=videoElement.currentTime;
        
        const poses = await detector.estimatePoses(videoElement, estimationConfig, timestamp);
        updateScreen(poses)
        
        updateVideo()
    }else {
        updateVideo()
    }
}


async function loadCamera(){
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
          'Browser API navigator.mediaDevices.getUserMedia not available');
    }
    const videoConfig = {
      'audio': false,
      'video': {
        facingMode: 'user',
        width: 640,
        height: 480,
        frameRate: {
          ideal: 30,
        }
      }
    };

    const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

    videoElement.srcObject = stream;

    await new Promise((resolve) => {
      videoElement.onloadedmetadata = () => {
        resolve(videoElement);
      };
    });

    videoElement.play();
    resizeCanvasToDisplaySize(canvasElement)

    const videoWidth = videoElement.videoWidth;
    const videoHeight = videoElement.videoHeight;
    // Must set below two lines, otherwise video element doesn't show.
    videoElement.width = videoWidth;
    videoElement.height = videoHeight;
    videoElement.onloadeddata = async function() {
        const poses = await detector.estimatePoses(videoElement, estimationConfig, timestamp);
        
        updateScreen(poses)
        updateVideo()

    }
}

async function loadApp(){
    await loadModel();
    loadCamera();
}

loadApp();

