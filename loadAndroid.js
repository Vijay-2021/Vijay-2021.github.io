
    function onResultsAndroid(results) {
        currentTime = performance.now();
        FPS = Math.round(1000*(1/(currentTime-lastTime)));
        timesOnResultsRan++; 
        FPSTotal += FPS; 
        avgFPS = Math.round(FPSTotal/timesOnResultsRan);
        if(updateFPS){
            FPSElement.innerHTML = "FPS: " + FPS + " Average FPS: " + avgFPS; updateFPS = false;
        }
        lastTime = currentTime;
        //canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        if(!results.poseLandmarks){return;}//if there are no pose landmarks don't draw them
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,{ color: '#00FF00', lineWidth: 2.0 });
        drawLandmarks(canvasCtx, results.poseLandmarks,{ color: '#FF0000', lineWidth: 1.0 });
        //canvasCtx.restore();
        console.log(results.poseLandmarks)
    }

    function loadAndroid(){
        const pose = new mpPose.Pose(poseOptions);
        pose.setOptions({
            modelComplexity: 0,
            smoothLandmarks: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });

        pose.onResults(this.onResultsAndroid);
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
