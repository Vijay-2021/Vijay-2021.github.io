
alert('tfjs test numberr four')
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
const flagConfig = {
    WEBGL_VERSION: 1,
    WASM_HAS_SIMD_SUPPORT: false,
    WASM_HAS_MULTITHREAD_SUPPORT: false,
    WEBGL_CPU_FORWARD:true,
    WEBGL_PACK: true,
    WEBGL_FORCE_F16_TEXTURES: true,
    WEBGL_RENDER_FLOAT32_CAPABLE: false,
    WEBGL_FLUSH_THRESHOLD: -1,
    CHECK_COMPUTATION_FOR_ERRORS: false,
  }
async function setBackendAndEnvFlags(flagConfig) {
    if (flagConfig == null) {
      return;
    } else if (typeof flagConfig !== 'object') {
      throw new Error(`An object is expected, while a(n) ${typeof flagConfig} is found.`);
    } // Check the validation of flags and values.
    try{
        tf.env().setFlags(flagConfig);
    }catch(error){
        alert("set flags broke");
    }
}


async function loadModel(){
    await setBackendAndEnvFlags(flagConfig)
    try{
    detector = await poseDetection.createDetector(model, detectorConfig);
    alert("model built sucessfulLY? ")
    }catch{
        alert("error?")
    }
    //start the camera after we have confitured the backend and loaded the detector 
    camera.start()
}
const estimationConfig = {flipHorizontal: true};
const timestamp = performance.now();
loadModel();
/**
   * Draw the keypoints and skeleton on the video.
   * @param poses A list of poses to render.
   */
  function drawResults(poses) {
    for (const pose of poses) {
      drawResult(pose);
    }
  }

  

const camera = new Camera(videoElement, {
    onFrame: async () => {

        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const poses = await detector.estimatePoses(videoElement.video, estimationConfig, timestamp);
        console.log(poses)
        if(poses.keypoints != null){
            console.log(poses.keypoints[0].x)
        }else{
            console.log('keypoints are null')
        }
        //alert("yay we are running :) ")
        
    }
});


