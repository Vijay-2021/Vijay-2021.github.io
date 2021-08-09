
/***
 * Might be worth renaming this file/this method to loadWindowsAndLinux
 * 
 * Might be worth trying a modelComplexity of 2(modelComplexity 0 is the lightest model, so it is the fastest but also it is the 
 * least accurate, 1 is second most accurate and second fastest, 2 is the most accurate/heaviest, but it is also the slowest, 
 * however windows/any PC may be fast enough to overcome this and still run at a good fps)
 */
async function loadWindows() {
    pose.setOptions({
        modelComplexity: 2,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });
    
    skeleton_type = "lumbar"

    pose.onResults(onResultsMediapipe);
}

