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

var lastKneePoses = []

function filterKnees(results){

    let lefthip =  results.poseLandmarks[23]
    let leftknee = results.poseLandmarks[25]
    let leftankle =  results.poseLandmarks[27]
    let righthip = results.poseLandmarks[24]
    let rightknee = results.poseLandmarks[26]
    let rightankle =  results.poseLandmarks[28]
    
    let currentKneePoses = []
    
    currentKneePoses.push(lefthip)
    currentKneePoses.push(leftKnee)
    currentKneePoses.push(leftAnkle)
    currentKneePoses.push(righthip)
    currentKneePoses.push(rightknee)
    currentKneePoses.push(rightankle)
    
    if(updateFPS&&(lefthip.visibility>0.5||righthip.visibility>0.5)&&(leftknee.visibility>0.5||rightknee.visibility>0.5)&&(leftankle.visibility>0.5||rightankle.visibility>0.5)){
        //console.log("left angles below, then right after")
        //console.log(calcAngles(leftankle,lefthip,leftknee))
        //console.log(calcAngles(rightankle,righthip,rightknee))
        console.log(calcDistance(lefthip,leftknee)/calcDistance(leftknee,leftankle))
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

    pose.onResults(windowsSetLandmarksFiltered);
}