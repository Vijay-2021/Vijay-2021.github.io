function setLandMarksAndroid(results) {
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results != null && results.poseLandmarks != null && results.poseLandmarks.length > 0) {
        results.poseLandmarks = createAdditionalJoints(results.poseLandmarks);
        for (var i = 0; i < results.poseLandmarks.length; i++) {
            results.poseLandmarks[i].x = results.poseLandmarks[i].x * canvasElement.width;
            results.poseLandmarks[i].y = results.poseLandmarks[i].y * canvasElement.height;
        }
        updateScreen(results.poseLandmarks)
    }
}

function loadAndroid() {

    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    pose.onResults(setLandMarksAndroid);

    var sentResizedMessage = false;

    const camera = new Camera(videoElement, {
        onFrame: async () => {
            //canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            //canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
            await pose.send({ image: videoElement });
            if (!sentResizedMessage) {
                console.log("Message: resize video");
                sentResizedMessage = true;
            }
        }
    });
    camera.start()
}

function q(a) {
    window.requestAnimationFrame(function () { r(a) })
}
function t(a, b) {
    a.video.srcObject = b; a.video.onloadedmetadata = function () { a.video.play(); q(a) }
}

function r(a) {
    var b = null; a.video.paused || a.video.currentTime === a.h || (a.h = a.video.currentTime, b = a.g.onFrame()); b ? b.then(function () { q(a) }) : q(a)
}

async function updateVideoAndroid() {
    if (counter == 0) {
        await pose.send({ image: videoElement })
        counter++
    }
    /**let stream = videoElement.srcObject
    let tracks= stream.getTracks()
    let counter2 = 0 
    for(let trackSetting in tracks[0].getSettings){
        counter2 ++;
        console.log(`Stream Tracks Setting ${counter2}: ${trackSetting}`)
    }*/

    window.requestAnimationFrame(function () { nextFrame() })
}

function nextFrame() {
    var frameUpdate = null;
    videoElement.paused || videoElement.currentTime === lastFrameTime || (lastFrameTime = videoElement.currentTime, frameUpdate = onFrameAndroid());
    frameUpdate ? frameUpdate.then(function () { updateVideoAndroid() }) : updateVideoAndroid()
}

async function onFrameAndroid() {
    await pose.send({ image: videoElement });
}
/***
 * 
async function updateVideo(){
    if(using_mediapipe){
        await pose.send({image: videoElement});
    }else{
        const poses = await detector.estimatePoses(videoElement, estimationConfig, timestamp);
        tfjsSetLandmarks(poses)
    }
    window.requestAnimationFrame(updateVideo);
}
 */
/**
 * Uses request animation frame and timestamping
 */
async function loadAndroidTimestamp() {

    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    await setupCamera()
    videoElement.onloadeddata = async function () {
        console.log(`Video Element Native Width: ${videoElement.videoWidth}`)
        console.log(`Video Element Native Height: ${videoElement.videoHeight}`)
        console.log(`Video Element Client Width: ${videoElement.width}`)
        console.log(`Video Element Client Height: ${videoElement.height}`)
        alert("pausing output")
        updateVideoAndroid()
        if (!sentResizedMessage) {
            console.log("Message: resize video");
            sentResizedMessage = true;
        }
    }

    pose.onResults(setLandMarksAndroid);

}