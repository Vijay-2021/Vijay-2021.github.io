function loadAndroid(){
    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });


    let counter = 0
    //when there are updated results, the onResults function will be ran 
    pose.onResults(onResultsMediapipe);
    const camera = new Camera(videoElement, {
        onFrame: async () => {
            if (counter == 1) {
                console.log("pose estimation has begun")
            }
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height); //draw the current video frame on the canvas

            var strDataURI = canvasElement.toDataURL('image/jpeg', 0.9); 
            htmlImageElement.src = strDataURI //set our image to the current video frame 

            /**
             * If the video width isn't null, then the video has started playing, and if the htmlImageElement isn't the same size
             * as the videoElement, then resize the htmlImageElement and make sure the canvas is the same size as the video 
             * element as well. Without this the pose does not draw properly/the pose predictions are not correct 
             */
            if (videoElement.videoWidth != null && videoElement.videoWidth > 0 && videoElement.videoWidth != htmlImageElement.width) {
                htmlImageElement.width = videoElement.videoWidth
                htmlImageElement.height = videoElement.videoHeight
                resizeCanvasToDisplaySize(canvasElement, videoElement)
            }
            await pose.send({ image: htmlImageElement });
            counter += 1
        },
        width: 640,
        height: 360
    });
    camera.start();
}