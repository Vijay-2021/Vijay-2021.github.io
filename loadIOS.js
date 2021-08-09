const detectorConfig = {
  runtime: 'tfjs',
  enableSmoothing: true,
  modelType: 'full'
};

async function loadIOS(flagConfig) {
  window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
  }
  await setEnvFlags(flagConfig)
  await loadModel()
}
async function loadModel() {
  detector = await poseDetection.createDetector(model, detectorConfig);
  //alert("model built sucessfully")
  //start the camera after we have loaded the model
  //camera.start()
}


function setEnvFlags(flagConfig) {
  if (flagConfig == null) {
    return;
  } else if (typeof flagConfig !== 'object') {
    throw new Error(`An object is expected, while a(n) ${typeof flagConfig} is found.`);
  } // Check the validation of flags and values.

  tf.env().setFlags(flagConfig);
}