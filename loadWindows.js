function windowsSetLandmarks(results){
    canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
    updateScreen(results.poseLandmarks)
    
}

async function loadWindows(){
    
    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    pose.onResults(windowsSetLandmarks);
}