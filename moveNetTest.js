
async function runTests(){
    const model = poseDetection.SupportedModels.MoveNet;
    const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};
    const detector = await poseDetection.createDetector(model, detectorConfig);
    const image = document.getElementById('test');
    const poses =  await detector.estimatePoses(image);
    console.log(poses)
}

runTests()


async function runTestsBlazePose(){
    const model = poseDetection.SupportedModels.BlazePose;
    const detectorConfig = {
        runtime: 'tfjs',
        enableSmoothing: true,
        modelType: 'lite'
      };
    const detector = await poseDetection.createDetector(model, detectorConfig);
    const image = document.getElementById('test');
    const poses =  await detector.estimatePoses(image);
    console.log(poses)
}

//runTestsBlazePose()