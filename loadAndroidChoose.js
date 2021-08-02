function setLandMarksAndroid(results){
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    if(results!=null&&results.poseLandmarks!=null&&results.poseLandmarks.length>0){
        results.poseLandmarks = createAdditionalJoints(results.poseLandmarks);
        for(var i=0; i < results.poseLandmarks.length;i++){
            results.poseLandmarks[i].x = results.poseLandmarks[i].x * canvasElement.width;
            results.poseLandmarks[i].y = results.poseLandmarks[i].y * canvasElement.height;
        }
        updateScreen(results.poseLandmarks)
    }
}

function loadAndroid(){

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
            if(!sentResizedMessage){
                console.log("Message: resize video");
                sentResizedMessage = true;
            }
        }
    });
    camera.start()
}

var lastFrameTime = 0 

async function updateVideoAndroid(){
    window.requestAnimationFrame(function(){nextFrame()})
}

function nextFrame(){
    videoElement.paused||videoElement.currentTime===lastFrameTime||(lastFrameTime=videoElement.currentTime);
    onFrameAndroid().then(function(){updateVideoAndroid()}) //so  if b exists, then use b.then, else just do q(a). and b is the onframe method, so we run b, then we call the funciton again! okay!
}

async function onFrameAndroid(){
    await pose.send({image: videoElement});
}
/**
 * Uses request animation frame and timestamping
 */
async function loadAndroidTimestamp(){

    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    await setupCamera()
    videoElement.onloadeddata = async function() {
        updateVideoAndroid()
        if(!sentResizedMessage){
            console.log("Message: resize video");
            sentResizedMessage = true;
        }
    }
    pose.onResults(setLandMarksAndroid);

}