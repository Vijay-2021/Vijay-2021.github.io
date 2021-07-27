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

const intervalId = window.setInterval(function(){updateFPS = true;}, 1000);

var using_mediapipe = false

var landmarks = {}

const mpPose = window;
    
const poseOptions = {
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.4.1624666670/${file}`;
    }
};

const pose = new mpPose.Pose(poseOptions);

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

function updateScreen(results){
    landmarks = results;
    drawConnectors(canvasCtx, results, POSE_CONNECTIONS,{ color: '#00FF00', lineWidth: 2.0 });
    drawLandmarks(canvasCtx, results,{ color: '#FF0000', lineWidth: 1.0 });
    console.log(results)
    runFPSUpdate()
}

async function tfjsSetLandmarks(poses){
    canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);

    if(poses != null && poses[0] != null){
        if (poses[0]['keypoints'] != null && poses[0]['keypoints'].length>0) {
            await updateScreen(poses[0]['keypoints'])
        }
    }
    return false;
}

async function updateVideo(){
    if(using_mediapipe){
        await pose.send({image: videoElement});
    }else{
        const poses = await detector.estimatePoses(videoElement, estimationConfig, timestamp);
        tfjsSetLandmarks(poses)
    }
    window.requestAnimationFrame(updateVideo);
}

const estimationConfig = {flipHorizontal: true};
const timestamp = performance.now();

async function loadCamera(){
    setupCamera()
    videoElement.onloadeddata = async function() {
        updateVideo()
        if(!sentResizedMessage){
            console.log("Message: resize video");
            sentResizedMessage = true;
        }
    }
}

async function setupApp(){

    var WEBGL_VERSION = 2
    var WASM_HAS_SIMD_SUPPORT = false
    var WASM_HAS_MULTITHREAD_SUPPORT= false
    var WEBGL_CPU_FORWARD=true
    var WEBGL_PACK= true
    var WEBGL_FORCE_F16_TEXTURES= false
    var WEBGL_RENDER_FLOAT32_CAPABLE= true
    var WEBGL_FLUSH_THRESHOLD= -1
    var CHECK_COMPUTATION_FOR_ERRORS= false

    wasmFeatureDetect.simd().then(simdSupported=>{
        if(simdSupported){
            alert("simd supported")
            WASM_HAS_SIMD_SUPPORT = true
        }else{
            alert("no simd")
        }
    });
    wasmFeatureDetect.threads().then(threadsSupported=>{
        if(threadsSupported){
            alert("multi thread supported")
            WASM_HAS_MULTITHREAD_SUPPORT = true;
        }else{
            alert("no multi thread")
        }
    });
    switch(getOS()){
        case 'Mac OS':
            alert('Mac detected')
            WEBGL_VERSION = 1
            break;
        case 'Windows':
        case 'Linux':
            using_mediapipe = true
            alert("windows or linux")
            break;
        case 'Android': 
            alert('android detected')
            setupCamera()
            await loadAndroid()
            return;
        default: 
            alert('ios or no type detected')
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
    
    if(using_mediapipe){
        await loadWindows()
        loadCamera();
    }else{
        await loadIOS(flagConfig)
        loadCamera();
    }
}
async function loadApp(){    
    await setupApp();    
}
loadApp();

