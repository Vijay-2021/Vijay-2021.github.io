alert('apple is using tfjs test 3')
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const FPSElement = document.getElementById('fps');


const model = poseDetection.SupportedModels.BlazePose;
const detectorConfig = {
  runtime: 'tfjs',
  enableSmoothing: true,
  modelType: 'full'
};
async function loadModel(){
    detector = await poseDetection.createDetector(model, detectorConfig);
    alert("model built sucessfulLY? ")
}
const estimationConfig = {flipHorizontal: true};
const timestamp = performance.now();
loadModel()

const camera = new Camera(videoElement, {
    onFrame: async () => {

        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        var poses = await detector.estimatePoses(videoElement, estimationConfig, timestamp);
        
        //alert("yay we are running :) ")
        
    }
});
camera.start()


