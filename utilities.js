function getOS() {
    var userAgent = window.navigator.userAgent,
        platform = window.navigator.platform,
        macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
        windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
        iosPlatforms = ['iPhone', 'iPad', 'iPod'],
        os = null;
  
    if (macosPlatforms.indexOf(platform) !== -1) {
      os = 'Mac OS';
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = 'iOS';
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = 'Windows';
    } else if (/Android/.test(userAgent)) {
      os = 'Android';
    } else if (!os && /Linux/.test(platform)) {
      os = 'Linux';
    }
  
    return os;
}

var FPS, avgFPS, currentTime,lastTime =0;
var updateFPS = false;
var timesOnResultsRan = 0; 
var FPSTotal =0;

function runFPSUpdate(){
    currentTime = performance.now();
    FPS = Math.round(1000*(1/(currentTime-lastTime)));
    timesOnResultsRan++; 
    FPSTotal += FPS; 
    avgFPS = Math.round(FPSTotal/timesOnResultsRan);
    if(updateFPS){
        FPSElement.innerHTML = "FPS: " + FPS + " Average FPS: " + avgFPS; updateFPS = false;
    }
    lastTime = currentTime;
}

async function setupCamera(){
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
            'Browser API navigator.mediaDevices.getUserMedia not available');
      }
      const videoConfig = {
        'audio': false,
        'video': {
          facingMode: 'user',
          width: {ideal: 240},
          height: {ideal: 180}
        }
      };
  
      const stream = await navigator.mediaDevices.getUserMedia(videoConfig);
  
      videoElement.srcObject = stream;
  
      await new Promise((resolve) => {
        videoElement.onloadedmetadata = () => {
          resolve(videoElement);
        };
      });
      videoElement.play();
      resizeCanvasToDisplaySize(canvasElement)
      const videoWidth = videoElement.videoWidth;
      const videoHeight = videoElement.videoHeight;
      // Must set below two lines, otherwise video element doesn't show.
      videoElement.width = videoWidth;
      videoElement.height = videoHeight;
}