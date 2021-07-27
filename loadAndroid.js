
function loadAndroid(){
    
    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    pose.onResults(mpSetLandmarks);
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
