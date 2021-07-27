var lastFrameTime = 0 

function setLandMarksAndroid(results){
    canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
    updateScreen(results.poseLandmarks)
}

async function updateVideoAndroid(){
    window.requestAnimationFrame(nextFrame)
}

function nextFrame(){
    videoElement.paused||videoElement.currentTime===lastFrameTime||(lastFrameTime=videoElement.currentTime);
    onFrameAndroid().then(function(){updateVideoAndroid()}) //so  if b exists, then use b.then, else just do q(a). and b is the onframe method, so we run b, then we call the funciton again! okay!
}

async function onFrameAndroid(){
    await pose.send({image: videoElement});
}
function loadAndroid(){

    pose.setOptions({
        modelComplexity: 0,
        smoothLandmarks: true,
        minDetectionConfidence: 0.75,
        minTrackingConfidence: 0.85
    });

    setupCamera()
    
    videoElement.onloadeddata = async function() {
        updateVideoAndroid()
        if(!sentResizedMessage){
            console.log("Message: resize video");
            sentResizedMessage = true;
        }
    }
    pose.onResults(setLandMarksAndroid);

}
