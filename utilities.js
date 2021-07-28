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

function createAdditionalJoints(poselandmarks) {
  let mid_shoulder = {
      visibility: 1,
      x: null,
      y: null,
      z: null,
  };

  let mid_torso = {
      visibility: 1,
      x: null,
      y: null,
      z: null,
  };

  let mid_left_torso = {
      visibility: 1,
      x: null,
      y: null,
      z: null,
  };

  let mid_right_torso = {
      visibility: 1,
      x: null,
      y: null,
      z: null,
  };

  let mid_hip = {
      visibility: 1,
      x: null,
      y: null,
      z: null,
  };

  let mid_knee = {
      visibility: 1,
      x: null,
      y: null,
      z: null,
  };

  let mid_ankle = {
      visibility: 1,
      x: null,
      y: null,
      z: null,
  };

  let mid_ear = {
      visibility: 1,
      x: null,
      y: null,
      z: null,
  };

  // MID EAR
  let rightearx = poselandmarks[8]["x"];
  let righteary = poselandmarks[8]["y"];
  let rightearz = poselandmarks[8]["z"];

  let leftearx = poselandmarks[7]["x"];
  let lefteary = poselandmarks[7]["y"];
  let leftearz = poselandmarks[7]["z"];

  // MID SHOULDER
  let rightshoulderx = poselandmarks[12]["x"];
  let rightshouldery = poselandmarks[12]["y"];
  let rightshoulderz = poselandmarks[12]["z"];

  let leftshoulderx = poselandmarks[11]["x"];
  let leftshouldery = poselandmarks[11]["y"];
  let leftshoulderz = poselandmarks[11]["z"];

  // MID HIP
  let righthipx = poselandmarks[24]["x"];
  let righthipy = poselandmarks[24]["y"];
  let righthipz = poselandmarks[24]["z"];

  let lefthipx = poselandmarks[23]["x"];
  let lefthipy = poselandmarks[23]["y"];
  let lefthipz = poselandmarks[23]["z"];

  // MID ANKLE
  let leftanklex = poselandmarks[27]["x"];
  let leftankley = poselandmarks[27]["y"];
  let leftanklez = poselandmarks[27]["z"];

  let rightanklex = poselandmarks[28]["x"];
  let rightankley = poselandmarks[28]["y"];
  let rightanklez = poselandmarks[28]["z"];

  // MID KNEE
  let leftkneex = poselandmarks[25]["x"];
  let leftkneey = poselandmarks[25]["y"];
  let leftkneez = poselandmarks[25]["z"];

  let rightkneex = poselandmarks[26]["x"];
  let rightkneey = poselandmarks[26]["y"];
  let rightkneez = poselandmarks[26]["z"];

  mid_shoulder.x = (rightshoulderx + leftshoulderx) / 2;
  mid_shoulder.y =
      (rightshouldery + leftshouldery) / 2 -
      (rightshouldery + leftshouldery) * 0.03;
  mid_shoulder.z = (rightshoulderz + leftshoulderz) / 2;

  mid_hip.x = (righthipx + lefthipx) / 2;
  mid_hip.y = (righthipy + lefthipy) / 2;
  mid_hip.z = (righthipz + lefthipz) / 2;

  mid_torso.x = (mid_shoulder.x + mid_hip.x) / 2;
  mid_torso.y = (mid_shoulder.y + mid_hip.y) / 2;
  mid_torso.z = (mid_shoulder.z + mid_hip.z) / 2;

  mid_left_torso.x = (leftshoulderx + lefthipx) / 2;
  mid_left_torso.y = (leftshouldery + lefthipy) / 2;
  mid_left_torso.z = (leftshoulderz + lefthipz) / 2;

  mid_right_torso.x = (rightshoulderx + righthipx) / 2;
  mid_right_torso.y = (rightshouldery + righthipy) / 2;
  mid_right_torso.z = (rightshoulderz + righthipz) / 2;

  mid_knee.x = (rightkneex + leftkneex) / 2;
  mid_knee.y = (rightkneey + leftkneey) / 2;
  mid_knee.z = (rightkneez + leftkneez) / 2;

  mid_ankle.x = (rightanklex + leftanklex) / 2;
  mid_ankle.y = (rightankley + leftankley) / 2;
  mid_ankle.z = (rightanklez + leftanklez) / 2;

  mid_ear.x = (rightearx + leftearx) / 2;
  mid_ear.y = (righteary + lefteary) / 2;
  mid_ear.z = (rightearz + leftearz) / 2;

  //33-mid-shoulder, 34: mid-torse, 35: mid-hip, 36: mid_knee, 37: mid_ankle, 38: mid_left_torse, 39: mid_right_torso, 40: mid_ear
  poselandmarks.push(mid_shoulder);
  poselandmarks.push(mid_torso);
  poselandmarks.push(mid_hip);
  poselandmarks.push(mid_knee);
  poselandmarks.push(mid_ankle);
  poselandmarks.push(mid_left_torso);
  poselandmarks.push(mid_right_torso);
  poselandmarks.push(mid_ear);

  return poselandmarks;
}

async function setupCamera(){
      
/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
            'Browser API navigator.mediaDevices.getUserMedia not available');
      }
      const videoConfig = {
        'audio': false,
        'video': {
          facingMode: 'user',
          width: {ideal: 640},
          height: {ideal: 480}
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