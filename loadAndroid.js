function loadAndroid(){
    pose.setOptions({
        modelComplexity: 1, //this seesm to work the best with android 
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
            htmlImageElement.src = strDataURI //set our image to the current video frame, so now in essence, the htmlImageElement is the same as videoElement

            /**
             * If the video width isn't null, then the video has started playing, and if the htmlImageElement isn't the same size
             * as the videoElement, then resize the htmlImageElement to the videoElement size and make sure the canvas is the same
             * size as the video element as well. Without this the pose does not draw properly/the pose predictions are not 
             * correct, my guess is becauese of some aspect ratio issues  
             */
            if (videoElement.videoWidth != null && videoElement.videoWidth > 0 && videoElement.videoWidth != htmlImageElement.width) {
                htmlImageElement.width = videoElement.videoWidth
                htmlImageElement.height = videoElement.videoHeight
                resizeCanvasToDisplaySize(canvasElement, videoElement)
            }
            await pose.send({ image: htmlImageElement });
            counter += 1
        },
        width: 640, //I have been using 640x360, but 640x480 seems functionaly equivalent, 1280x720 however is much slower, also on android the width and height will get flipped in portrait mode(e.g. we request a width and height of 640x360 but in the backend it is changed to 360x640)
        height: 360
    });
    camera.start();
}