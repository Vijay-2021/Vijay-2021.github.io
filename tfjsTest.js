
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
async function setEnvFlags(flagConfig) {
    
if (flagConfig == null) {
      return;
    } else if (typeof flagConfig !== 'object') {
      throw new Error(`An object is expected, while a(n) ${typeof flagConfig} is found.`);
    } // Check the validation of flags and values.
    
    tf.env().setFlags(flagConfig);

}


async function loadModel(){
    
    await setEnvFlags(flagConfig)
    
    detector = await poseDetection.createDetector(model, detectorConfig);
    //alert("model built sucessfulLY? ")
    
    //start the camera after we have configured the backend 
    camera.start()
}
const estimationConfig = {flipHorizontal: true};
const timestamp = performance.now();
loadModel();
  
var one = false;
const camera = new Camera(videoElement, {
    onFrame: async () => {

        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        canvasCtx.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);
        const poses = await detector.estimatePoses(canvasElement); 
        console.log(poses)
    }
});

