/***
 * Sets up configuration, there are two blazepose backend options, mediapipe and tfjs, we can't use medipaipe with IOS yet so 
 * we use tfjs, smoothing enables the temporal filter, and the model type is full. Full is equivalent to a model weight of 1 in 
 * mediapipe, the correspondence is as follows(0=lite, 1=full, 2=heavy)
 */
const detectorConfig = {
  runtime: 'tfjs',
  enableSmoothing: true,
  modelType: 'full'
};

/***
 * This function sets the environment flags and loads the model 
 */
async function loadIOS(flagConfig) {
  window.onerror = function (msg, url, linenumber) {
    alert('Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
    return true;
  }
  await setEnvFlags(flagConfig)
  await loadModel()
}

/***
 * Detector is a global variable, we initialize it here using our model(which is declared in combined.js and is the mediapipe
 * model) and our configuration 
 */
async function loadModel() {
  detector = await poseDetection.createDetector(model, detectorConfig);
  //alert("model built sucessfully")
  //start the camera after we have loaded the model
  //camera.start()
}

/***
 * This takes the environment flags and sets them using tf.env().setFlags(). 
 */
function setEnvFlags(flagConfig) {
  if (flagConfig == null) {
    return;
  } else if (typeof flagConfig !== 'object') {
    throw new Error(`An object is expected, while a(n) ${typeof flagConfig} is found.`);
  } // Check the validation of flags and values.

  tf.env().setFlags(flagConfig);
}