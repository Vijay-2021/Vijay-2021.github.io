function windowsSetLandmarks(results){

    canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
    
    if(results!=null&&results.poseLandmarks!=null&&results.poseLandmarks.length>0){
        results.poseLandmarks = createAdditionalJoints(results.poseLandmarks);
        for(var i=0; i < results.poseLandmarks.length;i++){
            results.poseLandmarks[i].x = results.poseLandmarks[i].x * canvasElement.width;
            results.poseLandmarks[i].y = results.poseLandmarks[i].y * canvasElement.height;
        }
        updateScreen(results.poseLandmarks)
    }
}

function calcRatioDifferential(lastPoses){

}
/***
 * using v = (xf -xi)/t
 * perhaps with world coordinates this can be further advanced. World coordinates give us the approximate position of each body 
 * part in meters with respect to the center of the hips, so if we can use something like that to determine the length of each limb
 * we may be able to approximate what the change in meters is(e.g a change of 30 pixels corresponds to a change in position corresponds
 * to a change of 1 meter) therefore we can approximate the velocity of the limb and constrain it much more easily. I doubt there
 * will be velocities over 1m/s, so we could cap it there, and ignore 
 */
function calcVelocityInPixelsPerSecond(lastPoses, lastTimestamps){


}

/**
 * assuming constant acceleration, using a = (vf -vi)/t. Not sure how useful this will be either, but maybe there is some acceleration 
 * limiting we can do along with velocity limiting. Lets say the jitter moves at .5m/s(or some arbitrary but relative based 
 * pixel)
 */ 
function calcAccelerationInPixelsPerSecond(lastPoses, lastTimestamps){

}

/**
 * We know the legs can't be above the hands in terms of the y coordinates(maybe, I doubt this would ever happen, but just incase
 * we could handle the case that someone uses their phone at a "weird" orientation) so we can just ignore any jitters that result 
 * in the hands being above the legs. 
 * If this returns false, then just ignore the point 
 */
function compareHandsAndLegs(leg, hand){
    let legY = leg['y']
    let handY = hand['y']
    return (legY > handY) //we want legY to be greater than handY
}

/***
 * Should return the number of frames to ignore, maybe even something about figuring out the last stable position 
 */
function checkAcceptableAccelerationAndVelocity(accel, vel, lastPoses){
    let viewHeight = window.innerHeight;
    let viewWidth = window.innerWidth;
    let lastIndex = lastPoses.length-1;
    let bodyHeightLeft = calcDistance(lastPoses[lastIndex]['leftShoulder'],lastPoses[lastIndex]['leftHip']) + calcDistance(lastPoses[lastIndex]['leftAnkle'],lastPoses[lastIndex]['leftHip'])
    let bodyHeightRight = calcDistance(lastPoses[lastIndex]['rightShoulder'],lastPoses[lastIndex]['rightHip']) + calcDistance(lastPoses[lastIndex]['rightAnkle'],lastPoses[lastIndex]['righHip'])
    let bodyHeight = calculateAverageElements(bodyHeightLeft,bodyHeightRight)
    let bodyWidth = calcDistance(lastPoses[lastIndex]['leftShoulder'],lastPoses['rightShoulder'])
    let windowBodyRatio = calcAverateElements((viewHeight / bodyHeight), (viewWidth/bodyWidth)) 
}

var lastPoses = []
var lastTimestamps = []
function filterKnees(results){

    let leftHip =  results.poseLandmarks[23]
    let leftKnee = results.poseLandmarks[25]
    let leftAnkle =  results.poseLandmarks[27]
    let rightHip = results.poseLandmarks[24]
    let rightKnee = results.poseLandmarks[26]
    let rightAnkle =  results.poseLandmarks[28]
    let leftShoulder = results.poseLandmarks[11]
    let rightShoulder = results.poseLandmarks[12]
    
    let currentPoses = []
    
    currentPoses.push(leftHip)
    currentPoses.push(leftKnee)
    currentPoses.push(leftAnkle)
    currentPoses.push(rightHip)
    currentPoses.push(rightKnee)
    currentPoses.push(rightAnkle)
    currentPoses.push(leftShoulder)
    currentPoses.push(rightShoulder)
    
    if(updateFPS&&(leftHip.visibility>0.5||rightHip.visibility>0.5)&&(leftKnee.visibility>0.5||rightKnee.visibility>0.5)&&(leftAnkle.visibility>0.5||rightAnkle.visibility>0.5)){
        //console.log("left angles below, then right after")
        //console.log(calcAngles(leftAnkle,leftHip,leftKnee))
        //console.log(calcAngles(rightAnkle,rightHip,rightKnee))
        //console.log(calcDistance(leftHip,leftKnee)/calcDistance(leftKnee,leftAnkle))
        let totalLeftLegLength = calcDistance(leftHip,leftKnee) + calcDistance(leftKnee,leftAnkle)
        let totalRightLegLength = calcDistance(rightHip,rightKnee) + calcDistance(rightKnee,rightAnkle)
        let leftShoulderToHip = calcDistance(leftShoulder,leftHip)
        let rightShoulderToHip = calcDistance(rightShoulder,rightHip)

        
        
    }
    return results;//change this later obviously
}
/***
 * This function aims to filter out the jitters 
 */
function windowsSetLandmarksFiltered(results){

    canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
    canvasCtx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
    
    if(results!=null&&results.poseLandmarks!=null&&results.poseLandmarks.length>0){
        results.poseLandmarks = createAdditionalJoints(results.poseLandmarks);
        for(var i=0; i < results.poseLandmarks.length;i++){
            results.poseLandmarks[i].x = results.poseLandmarks[i].x * canvasElement.width;
            results.poseLandmarks[i].y = results.poseLandmarks[i].y * canvasElement.height;
        }
        results = filterKnees(results)
        updateScreen(results.poseLandmarks)
        
    }
}


async function loadWindows(){
    
    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    pose.onResults(windowsSetLandmarks);
}


async function loadWindowsFilter(){
    
    pose.setOptions({
        modelComplexity: 1,
        smoothLandmarks: false,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
3
    pose.onResults(windowsSetLandmarksFiltered);
}