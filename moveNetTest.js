
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const FPSElement = document.getElementById('fps');


const model = poseDetection.SupportedModels.MoveNet;

const score_threshold = 0.5
var line_width = 1
var radius = 3
var updateFPS = false

const detectorConfig = { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING, enableSmoothing: true };

var sentResizedMessage = false;

const intervalId = window.setInterval(function () { updateFPS = true; }, 1000);

/***
 * Fixes canvas size, without the mediapipe utils the canvas is not sized correctly(either that or I implemented canvas wrong)
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
 * Poses is a 2d array of json keypoint objects for tfjs(we only need to worry about the first index though as blazepose only 
 * detects a single person)
 */
function drawResults(poses) {
    if (poses != null && poses[0] != null) {
        if (poses[0]['keypoints'] != null) {
            drawKeypoints(poses[0]['keypoints']);
            drawSkeleton(poses[0]['keypoints']);
        }
        else {
            //alert("no keypoints")
        }
    } else {
        return;
    }
}

/**
* Draw the keypoints on the videoElement.
* @param keypoints A list of keypoints.
*/


/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
/***
 * Draw keypoints, drawKeypoint and drawSkeleton were taken from googles mediapipe camera class, for which the liscense is above
 * DrawKeypoints sets up the canvas and calls drawKeypoint for each individual keypoint
 */
function drawKeypoints(keypoints) {

    canvasCtx.fillStyle = 'Green';
    canvasCtx.strokeStyle = 'White';
    canvasCtx.lineWidth = line_width;

    for (var i = 0; i < keypoints.length; i++) {
        drawKeypoint(keypoints[i])
    }
}

function drawKeypoint(keypoint) {

    const score = keypoint.score != null ? keypoint.score : 1; // If score is null, just show the keypoint.
    const scoreThreshold = score_threshold || 0; // if there is no score threshold then set it to 0 
    if (score >= scoreThreshold) {
        const circle = new Path2D();
        circle.arc(keypoint.x, keypoint.y, radius, 0, 2 * Math.PI);
        canvasCtx.fill(circle);
        canvasCtx.stroke(circle);
    }
}
/**
* Draw the skeleton of a body on the canvas.
* @param keypoints A list of keypoints.
*/
function drawSkeleton(keypoints) {
    canvasCtx.fillStyle = 'White';
    canvasCtx.strokeStyle = 'White';
    canvasCtx.lineWidth = line_width;

    poseDetection.util.getAdjacentPairs(model).forEach(([i, j]) => { //gets the keypoint pairs for the generic skeleton and draws them if they are over the threshold
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

var FPS, avgFPS, currentTime, lastTime = 0;
var updateFPS = false;
var timesOnResultsRan = 0;
var FPSTotal = 0;

/***
 * Unlike combined, the entirety of the screen update is done in here. First we update the fps, then we clear and re-draw the lastest
 * video frame on the canvas. After this we make sure the poses, pose, and keypoints array are not null(because poseNet can output
 * multiple poses for different people, the tfjs poses api returns an array of poses. Since we are using movenet, we can assume
 * that if poses is not null, then we only have to worry about the first pose as only one pose will be returned from movenet, hence
 * why poses[0] is hardcoded in)
 */
function updateScreen(poses) {
    currentTime = performance.now();
    FPS = Math.round(1000 * (1 / (currentTime - lastTime)));
    timesOnResultsRan++;
    FPSTotal += FPS;
    avgFPS = Math.round(FPSTotal / timesOnResultsRan);
    if (updateFPS) {
        FPSElement.innerHTML = "FPS: " + FPS + " Average FPS: " + avgFPS; updateFPS = false;
    }
    lastTime = currentTime;
    canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);

    if (poses != null && poses[0] != null) {
        if (poses[0]['keypoints'] != null) {
            drawResults(poses)
            //console.log(`Client height: ${canvasElement.clientHeight}`)
            //console.log(`Client width: ${canvasElement.clientWidth}`)
            //console.log(`height: ${canvasElement.height}`)
            //console.log(`width: ${canvasElement.width}`)
            console.log(JSON.stringify(poses[0]['keypoints']))
        }
    }
}

/***
 * Using request animation frame to handle the loop, no timestamp check here, perhaps that can be implemeneted 
 */
async function updateVideo() {
    const poses = await detector.estimatePoses(videoElement, estimationConfig, timestamp);
    updateScreen(poses)
    window.requestAnimationFrame(updateVideo);
}

/***
 * This next set of functions is the same as the loadModel functions in loadIOS.js
 */
async function loadModel(flagConfig) {
    await setFlags(flagConfig);
    detector = await poseDetection.createDetector(model, detectorConfig);
    //alert("model built sucessfully")
    //start the camera after we have loaded the model
    //camera.start()
}

async function setEnvFlags(flagConfig) {

    if (flagConfig == null) {
        return;
    } else if (typeof flagConfig !== 'object') {
        throw new Error(`An object is expected, while a(n) ${typeof flagConfig} is found.`);
    } // Check the validation of flags and values.

    tf.env().setFlags(flagConfig);

}

const estimationConfig = { flipHorizontal: true };
const timestamp = performance.now();

/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

/***
 * This sets up the camera, in essence it does the same thing as loadCamera in combined.js, except the setupCamera() 
 * function is nested inside this function. So here we setup the camera, and handle the onloadeddata(aka first frame has 
 * been loaded) event in the same function. Here we also don't send the resize message onloadeddata for it was causing sizing 
 * issues, instead we just start the updateVideo loop
 */
async function loadCamera() {
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

    videoElement.onloadeddata = async function () {
        /**if(!sentResizedMessage){
            console.log("Message: resize video");
            sentResizedMessage = true;
        }*/
        updateVideo()

    }
}

function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
        os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
        os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
        os = 'Windows';
    } else if (/Android/.test(userAgent)) {
        os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
        os = 'Linux';
    }

    return os;
}

/***
 * First we check for WASM features as we do in combined.js. However, here all platforms are using tfjs backend, so the configuration
 * is slightly different then the combined.js equivalent of this function(setupApp). For linux and windows(windows
 * is the default case) we use the default flag configuration, webgl_2, float_32 textures, etc. For MAC everything is 
 * default except WEB_GL version is 1. Both Android and IOS have float 32 textures turned off and float 16 textures turned on. 
 * Android also has an increased line_width and radius. 
 */
function setFlags() {

    var WEBGL_VERSION = 2
    var WASM_HAS_SIMD_SUPPORT = false
    var WASM_HAS_MULTITHREAD_SUPPORT = false
    var WEBGL_CPU_FORWARD = true
    var WEBGL_PACK = true
    var WEBGL_FORCE_F16_TEXTURES = false
    var WEBGL_RENDER_FLOAT32_CAPABLE = true
    var WEBGL_FLUSH_THRESHOLD = -1
    var CHECK_COMPUTATION_FOR_ERRORS = false

    wasmFeatureDetect.simd().then(simdSupported => {
        if (simdSupported) {
            //  alert("simd supported")
            WASM_HAS_SIMD_SUPPORT = true
        } else {
            // alert("no simd")
        }
    });
    wasmFeatureDetect.threads().then(threadsSupported => {
        if (threadsSupported) {
            // alert("multi thread supported")
            WASM_HAS_MULTITHREAD_SUPPORT = true;
        } else {
            // alert("no multi thread")
        }
    });
    switch (getOS()) {
        case 'Mac OS':
            // alert('Mac detected')
            WEBGL_VERSION = 1
            break;
        case 'Linux':
            // alert('linux detected')
            break;
        case 'iOS':
            // alert('ios detected')
            WEBGL_VERSION = 1
            WEBGL_FORCE_F16_TEXTURES = true //use float 16s on mobile just incase 
            WEBGL_RENDER_FLOAT32_CAPABLE = false
            break;
        case 'Android':
            WEBGL_FORCE_F16_TEXTURES = true
            WEBGL_RENDER_FLOAT32_CAPABLE = false
            line_width = 3
            radius = 4
            // alert('android detected')
            break;
        default:
            // alert('windows detected')
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

    setEnvFlags(flagConfig)

}
/***
 * Load the model first then setup the camera 
 */
async function loadApp() {
    await loadModel();
    loadCamera();
}

loadApp();

