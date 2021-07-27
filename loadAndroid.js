function setLandMarksAndroid(){
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    
    if(results!=null&&results.poseLandmarks!=null&&results.poseLandmarks.length>0){
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
            alert("this is running, this is a good sing")
            alert(videoElement.width)
            alert(canvasElement.width)
            alert(videoElement.height)
            alert(canvasElement.height)
            await pose.send({ image: videoElement });
            if(!sentResizedMessage){
                console.log("Message: resize video");
                sentResizedMessage = true;
            }
        }
    });
    camera.start()
}
