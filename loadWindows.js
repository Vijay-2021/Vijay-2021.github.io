function windowsSetLandmarks(results){

    canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
    
    if(results!=null&&results.poseLandmarks!=null&&results.poseLandmarks.length>0){
        results.poseLandmarks = createAdditionalJoints(results.poseLandmarks);
        for(var i=0; i < results.poseLandmarks.length;i++){
            results.poseLandmarks[i].x = results.poseLandmarks[i].x * canvasElement.width;
            results.poseLandmarks[i].y = results.poseLandmarks[i].y * canvasElement.height;
        }
        updateScreen(results.poseLandmarks)
    }
}

async function loadWindows(){
    
    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    pose.onResults(windowsSetLandmarks);
}