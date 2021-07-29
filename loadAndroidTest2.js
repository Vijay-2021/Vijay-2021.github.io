var lastFrameTime = 0 

function setLandMarksAndroid(results){
    canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
    alert(results.poseLandmarks.length)
    updateScreen(results.poseLandmarks)
}

async function updateVideoAndroid(){
    alert("frames are being processed")
    window.requestAnimationFrame(function(){nextFrame()})
}

function nextFrame(){
    videoElement.paused||videoElement.currentTime===lastFrameTime||(lastFrameTime=videoElement.currentTime);
    onFrameAndroid().then(function(){updateVideoAndroid()}) //so  if b exists, then use b.then, else just do q(a). and b is the onframe method, so we run b, then we call the funciton again! okay!
}

async function onFrameAndroid(){
    await pose.send({image: videoElement});
}
async function loadAndroid(){

    pose.setOptions({
        modelComplexity: 1,
        static_image_mode: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.75
    });
    alert("pose has been loaded")
    await setupCamera()
    alert("camera has been setup")
    videoElement.onloadeddata = async function() {
        updateVideoAndroid()
        if(!sentResizedMessage){
            console.log("Message: resize video");
            sentResizedMessage = true;
        }
    }
    pose.onResults(setLandMarksAndroid);

}
