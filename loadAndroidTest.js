
function setLandMarksAndroid(results) {
    canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
    canvasCtx.drawImage(results.image, 0, 0, videoElement.width, videoElement.height);
    console.log("pose landmarks below: ")
    console.log(results.poseLandmarks)
    var pixelData = canvasCtx.getImageData(100, 100, 1, 1).data;
    console.log(pixelData)
    alert(results.poseLandmarks.length)
    //updateScreen(results)
}
function clearAndRedrawScreen() {
    canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
}

async function updateVideoAndroid() {
    alert("frames are being processed")

    await pose.send({ image: videoElement });
    window.requestAnimationFrame(updateVideoAndroid())
}

function nextFrame() {
    console.log(videoElement.currentTime)
    if (videoElement.currentTime != lastFrameTime) {
        lastFrameTime = videoElement.currentTime;
        onFrameAndroid().then(function () { updateVideoAndroid() })
    } //so  if b exists, then use b.then, else just do q(a). and b is the onframe method, so we run b, then we call the funciton again! okay!
}

async function onFrameAndroid() {
    await pose.send({ image: videoElement });
}
async function loadAndroid() {

    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    alert("pose has been loaded")
    await setupCamera()
    alert("camera has been setup")
    videoElement.onloadeddata = async function () {
        updateVideoAndroid()
        if (!sentResizedMessage) {
            console.log("Message: resize video");
            sentResizedMessage = true;
        }
    }
    pose.onResults(setLandMarksAndroid);

}