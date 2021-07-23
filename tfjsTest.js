alert('apple is using tfjs test')
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const FPSElement = document.getElementById('fps');


const model = poseDetection.SupportedModels.BlazePose;
const detectorConfig = {
  runtime: 'tfjs',
  enableSmoothing: true,
  modelType: 'lite'
};

detector = await poseDetection.createDetector(model, detectorConfig);
alert("model built sucessfulLY? ")

const estimationConfig = {flipHorizontal: true};
const timestamp = performance.now();


const camera = new Camera(videoElement, {
    onFrame: async () => {
        
        try{
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
            var poses = await detector.estimatePoses(image, estimationConfig, timestamp);
            alert("yay we are running :) ")
        }
        catch(error){
            alert("error")
        }
        if(!sentResizedMessage){
            console.log("Message: resize video");
            sentResizedMessage = true;
        }
    }
});
camera.start()


