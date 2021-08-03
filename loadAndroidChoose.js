function setLandMarksAndroid(results){
    console.log("on results is running")
    //console.log(`Image: ${JSON.stringify(results.image)}`)
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
    
    if(results!=null){
        console.log("results object is not null")
        if(results.poseLandmarks!=null){
            console.log("results pose landmarks is not null")
            if(results.poseLandmarks.length>0){
                console.log("there are more than zero land marks")
                results.poseLandmarks = createAdditionalJoints(results.poseLandmarks);
                for(var i=0; i < results.poseLandmarks.length;i++){
                    results.poseLandmarks[i].x = results.poseLandmarks[i].x * canvasElement.width;
                    results.poseLandmarks[i].y = results.poseLandmarks[i].y * canvasElement.height;
                }
            }
        }
        if(results.image!=null){
            console.log("results image is not null")
        }
        //updateScreen(results.poseLandmarks)
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
    console.log("update video android is running")
    window.requestAnimationFrame(function(){nextFrame()})
}

function nextFrame(){
    
    console.log(`current time: ${videoElement.currentTime}`)
    console.log(`last frame time: ${lastFrameTime}`)
    if(videoElement.currentTime!=lastFrameTime){
        lastFrameTime=videoElement.currentTime
        onFrameAndroid().then(function(){updateVideoAndroid()});
    } //so  if b exists, then use b.then, else just do q(a). and b is the onframe method, so we run b, then we call the funciton again! okay!
}

async function onFrameAndroid(){
    console.log("on frame android is running")
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
    setupCamera()
    console.log("camera setup")
    videoElement.onloadeddata = async function() {
        updateVideoAndroid()
        if(!sentResizedMessage){
            console.log("Message: resize video");
            console.log(videoElement.currentTime)
            sentResizedMessage = true;
        }
    }
    pose.onResults(setLandMarksAndroid);

}