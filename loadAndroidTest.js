function setLandMarksAndroid(results){
   // canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
   // canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
    console.log(JSON.stringify(results))
    var canvas = document.getElementById('canvas');
    var dataURL = canvas.toDataURL();
    console.log(dataURL);
    if(results!=null&&results.poseLandmarks!=null&&results.poseLandmarks.length>0){
        results.poseLandmarks = createAdditionalJoints(results.poseLandmarks);
        var pixelData = canvasCtx.getImageData(100, 100, 1, 1).data;
        console.log(pixelData)
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
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
            
            await pose.send({ image: videoElement });
            if(!sentResizedMessage){
                console.log("Message: resize video");
                sentResizedMessage = true;
            }
        }
    });
    camera.start()
}