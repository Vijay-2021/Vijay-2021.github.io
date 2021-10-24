/***
 * This function is used to get the operating system that we are running. It is accurate most of the time according to its 
 * creator. In-case it fails perhaps there should be some sort of fallback, e.g. using a less efficient configuration but 
 * one that would be supported on all operating systems 
 */
function getOS() {
  let userAgent = window.navigator.userAgent,
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

var FPS, avgFPS, currentTime, lastTime = 0;
var updateFPS = false;
var timesOnResultsRan = 0;
var FPSTotal = 0;
/***
 * This function measures the time between when it was last called and the current time, thus as long as it is only called once 
 * per loop, it can accurately measure the time between loops. We use performance.now() instead of date.now() as it is supposed 
 * to be more accurate. performance.now() returns the time in milliseconds since Jan 1st 1970 so we scale the frequency of frames
 * (eg.g 1/(currentTime - lastTime)) by 1000 to get it in seconds. Then we update the average fps, and update the display. Finally
 * the lastTime is set to the currentTime variable (this ensures that the time taken to run the fps update itself is taken 
 * into account)
 */
function runFPSUpdate() {
  currentTime = performance.now();
  FPS = Math.round(1000 * (1 / (currentTime - lastTime)));
  timesOnResultsRan++;
  FPSTotal += FPS;
  avgFPS = Math.round(FPSTotal / timesOnResultsRan);
  // if (updateFPS) {
  //   FPSElement.innerHTML = "FPS: " + FPS + " Average FPS: " + avgFPS; updateFPS = false;
  // }
  lastTime = currentTime;
}

/***
 * This function creates the extra landmarks for the lumbar skeleton 
 */
function createAdditionalJoints(poselandmarks) {
  let mid_shoulder = {
    score: 1,
    visibility: 1,
    x: null,
    y: null,
    z: null,
  };

  let mid_torso = {
    score: 1,
    visibility: 1,
    x: null,
    y: null,
    z: null,
  };

  let mid_left_torso = {
    score: 1,
    visibility: 1,
    x: null,
    y: null,
    z: null,
  };

  let mid_right_torso = {
    score: 1,
    visibility: 1,
    x: null,
    y: null,
    z: null,
  };

  let mid_hip = {
    score: 1,
    visibility: 1,
    x: null,
    y: null,
    z: null,
  };

  let mid_knee = {
    score: 1,
    visibility: 1,
    x: null,
    y: null,
    z: null,
  };

  let mid_ankle = {
    score: 1,
    visibility: 1,
    x: null,
    y: null,
    z: null,
  };

  let mid_ear = {
    score: 1,
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

/***
 * This function draws the bounding box for cervical selection. 
 */

function drawForwardFacingMarker(canvasCtx, bodypart) {
  //0: Nose, 1: Mid_ear, 2: Mid_Shoulder, 3: Left_Shoulder, 4: Right_Shoulder
  canvasCtx.beginPath();
  canvasCtx.strokeStyle = "white";
  canvasCtx.lineWidth = 1;
  //Create a line 
  canvasCtx.moveTo(bodypart[3].x, bodypart[2].y);
  canvasCtx.lineTo(bodypart[2].x, bodypart[2].y);
  canvasCtx.lineTo(bodypart[4].x, bodypart[2].y);
  canvasCtx.stroke();


  //Create Circle at 0'
  canvasCtx.beginPath();
  canvasCtx.strokeStyle = "#01FD0C";
  canvasCtx.arc(bodypart[2].x, bodypart[2].y, 10, 0, 2 * Math.PI);
  canvasCtx.stroke();

  //Create Inside Circle at 0'
  canvasCtx.beginPath();
  canvasCtx.strokeStyle = "blue";
  canvasCtx.fillStyle = "blue";
  canvasCtx.arc(bodypart[1].x, bodypart[2].y, 5, 0, 2 * Math.PI);
  canvasCtx.fill();
  canvasCtx.stroke();

  canvasCtx.restore();

}
/***
 * This function draws the joints for different skeletons. Currently we are using it to draw the full skeleton
 */
function drawJoints(canvasCtx, poses, ctxwidth, ctxheight, parttype) {
  let width = ctxwidth;
  let height = ctxheight;
  let bodypart;

  let fullbody = [
    poses[11],
    poses[12],
    poses[13],
    poses[14],
    poses[15],
    poses[16],
    poses[23],
    poses[24],
    poses[25],
    poses[26],
    poses[27],
    poses[28],
    poses[32],
    poses[31],
    poses[33],
    poses[34],
    poses[35],
  ];

  let bodyjoints = [
    poses[40],
    poses[11],
    poses[12],
    poses[13],
    poses[14],
    poses[15],
    poses[16],
    poses[23],
    poses[24],
    poses[25],
    poses[26],
    poses[27],
    poses[28],
    poses[31],
    poses[32],
    poses[33],
    poses[34],
    poses[35],
    poses[36],
    poses[37],
    poses[38],
    poses[39],
  ];

  let upperbody = [
    poses[11],
    poses[12],
    poses[13],
    poses[14],
    poses[15],
    poses[16],
    poses[23],
    poses[24],
    poses[33],
    poses[34],
    poses[35],
  ];

  let lowerbody = [
    poses[23],
    poses[24],
    poses[25],
    poses[26],
    poses[27],
    poses[28],
    poses[31],
    poses[32],
    poses[35],
  ];

  let sidebody = [
    poses[23],
    poses[24],
    poses[25],
    poses[26],
    poses[27],
    poses[28],
    poses[31],
    poses[32],
    poses[33],
    poses[34],
    poses[35],
  ];


  //0: Nose, 40: Mid_ear, 33: Mid_Shoulder 
  let cervical = [
    poses[0],
    poses[40],
    poses[33],
    poses[11],
    poses[12]
  ];

  if (parttype == "cervical") {
    bodypart = cervical;
  } else {
    bodypart = fullbody
  }

  if (parttype !== "cervical") {
    for (let i = 0; i < bodypart.length; i++) {
      canvasCtx.beginPath();
      canvasCtx.strokeStyle = "#01FD0C";
      canvasCtx.fillStyle = "#01FD0C";
      canvasCtx.lineWidth = 2;
      let g = new Path2D();
      g.arc(bodypart[i].x, bodypart[i].y, 2.0, 0, 2 * Math.PI);
      canvasCtx.fill(g);
      canvasCtx.stroke(g);
    }
  }

  //Face Box Code 
  if (parttype == "cervical") {
    drawForwardFacingMarker(canvasCtx, bodypart)
  }

  canvasCtx.restore();

}

//33-mid-shoulder, 34: mid-torse, 35: mid-hip, 36: mid_knee, 
//37: mid_ankle, 38: mid_left_torse, 39: mid_right_torso
/***
 * This function draws connections for the lumbar skeleton 
 */
function drawConnections(canvasCtx, poses, ctxwidth, ctxheight) {
  let width = ctxwidth;
  let height = ctxheight;

  let shoulder = [poses[12], poses[33], poses[11]];
  let righthand = [poses[16], poses[14], poses[12]];
  let middletorso = [poses[33], poses[34], poses[35]];
  let lefthand = [poses[11], poses[13], poses[15]];

  let hip = [poses[24], poses[35], poses[23]];
  let rightLeg = [poses[24], poses[26], poses[28], poses[32]];
  let leftLeg = [poses[23], poses[25], poses[27], poses[31]];


  canvasCtx.beginPath();
  canvasCtx.strokeStyle = "#00C0F0";
  //canvasCtx.strokeStyle = "white";
  canvasCtx.lineWidth = 3;

  //Shoulder Segment
  canvasCtx.moveTo(shoulder[0].x, shoulder[0].y);
  canvasCtx.lineTo(shoulder[1].x, shoulder[1].y);
  canvasCtx.lineTo(shoulder[2].x, shoulder[2].y);

  //Right Hand Segment
  canvasCtx.moveTo(righthand[0].x, righthand[0].y);
  canvasCtx.lineTo(righthand[1].x, righthand[1].y);
  canvasCtx.lineTo(righthand[2].x, righthand[2].y);

  //Left Hand Segment
  canvasCtx.moveTo(lefthand[0].x, lefthand[0].y);
  canvasCtx.lineTo(lefthand[1].x, lefthand[1].y);
  canvasCtx.lineTo(lefthand[2].x, lefthand[2].y);

  //Middle Torso Segment
  canvasCtx.moveTo(middletorso[0].x, middletorso[0].y);
  canvasCtx.lineTo(middletorso[1].x, middletorso[1].y);
  canvasCtx.lineTo(middletorso[2].x, middletorso[2].y);

  //Hip Segment
  canvasCtx.moveTo(hip[0].x, hip[0].y);
  canvasCtx.lineTo(hip[1].x, hip[1].y);
  canvasCtx.lineTo(hip[2].x, hip[2].y);

  //Left Foot Segment
  canvasCtx.moveTo(leftLeg[0].x, leftLeg[0].y);
  canvasCtx.lineTo(leftLeg[1].x, leftLeg[1].y);
  canvasCtx.lineTo(leftLeg[2].x, leftLeg[2].y);
  canvasCtx.lineTo(leftLeg[3].x, leftLeg[3].y);

  //Right Foot Segment
  canvasCtx.moveTo(rightLeg[0].x, rightLeg[0].y);
  canvasCtx.lineTo(rightLeg[1].x, rightLeg[1].y);
  canvasCtx.lineTo(rightLeg[2].x, rightLeg[2].y);
  canvasCtx.lineTo(rightLeg[3].x, rightLeg[3].y);

  canvasCtx.stroke();
  canvasCtx.restore();
}

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
/***
 * This function was taken from googles camera class, it was necessary to follow these steps in the camera class to get the 
 * tfjs backend to run. If the webcam is not configured in this way, then the tfjs backend does not run correctly. This 
 * camera setup is also used for windows, for although windows could use the mediapipe camera class, this provides more 
 * customizability 
 */
async function setupCamera() {
  console.log("setting up camera")

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error(
      'Browser API navigator.mediaDevices.getUserMedia not available');
  }
  const videoConfig = {
    'audio': false,
    'video': {
      facingMode: 'user',
      width: { ideal: 640 },
      height: { ideal: 480 }
    }
  };

  const stream = await navigator.mediaDevices.getUserMedia(videoConfig);

  videoElement.srcObject = stream; //create a stream and make it video source 

  await new Promise((resolve) => {
    videoElement.onloadedmetadata = () => {
      resolve(videoElement);
    };
  });
  videoElement.play();
  resizeCanvasToDisplaySize(canvasElement) //resize the canvas to be the videoElement.videoWidth /videoElement.videoHeight after onloadedmetadata has finished
  const videoWidth = videoElement.videoWidth;
  const videoHeight = videoElement.videoHeight;
  // Must set below two lines, otherwise video element doesn't show.
  videoElement.width = videoWidth;
  videoElement.height = videoHeight;
}

/**
 * Calculate the angle C w/ Law of Cosines based on this picture https://images.app.goo.gl/AWhopMcNj85L4de77 and where a,b,c correspond to the points, not the lines
*/

function calcAngles(a, b, c) {

  let aX = a['x'];
  let aY = a['y'];
  let bX = b['x'];
  let bY = b['y'];
  let cX = c['x'];
  let cY = c['y'];

  let sideC = Math.sqrt(Math.pow((aX - bX), 2) + Math.pow((aY - bY), 2)); //use distance formula to get sides for Law of Cosines
  let sideA = Math.sqrt(Math.pow((bX - cX), 2) + Math.pow((bY - cY), 2));
  let sideB = Math.sqrt(Math.pow((aX - cX), 2) + Math.pow((aY - cY), 2));
  console.log("aX: " + aX + " aY: " + aY + " bX: " + bX + " bY: " + bY + " cX: " + cX + " cY: " + cY + " sideA: " + sideA + " sideB: " + sideB + " sideC: " + sideC);

  let angle = Math.acos((Math.pow(sideA, 2) + Math.pow(sideB, 2) - Math.pow(sideC, 2)) / (2 * sideA * sideB)); // Law of Cosines
  let angleDeg = (180 * angle) / Math.PI;
  return angleDeg;
}

/***
 * Calculates distance between two keypoints
 */
function calcDistance(a, b) {
  let aX = a['x'];
  let aY = a['y'];
  let bX = b['x'];
  let bY = b['y'];
  return Math.sqrt(Math.pow((aX - bX), 2) + Math.pow((aY - bY), 2));
}

/***
 * Calculates the average value of an array 
 */
function calculateAverageArray(array) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i]
  }
  return total / array.length;
}

/***
 * Calculates the average value of elements 
 */
function calculateAverageElements(...array) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += array[i]
  }
  return total / array.length;
}

/***
 * This function serves as the on results function for anything using mediapipe. Currently only Windows/Linux/Android use Mediapipe
 * so this function corresponds to those platforms, but if IOS and Mac are moved to mediapipe, this function will work for them
 * as well and perhaps the "un-normalization or conversion to pixel coordinates can be taken out". The reason I do un-normalization
 * now is because the tfjs landmarks are "un-normalized" and handling that correclty seemed like it could be more complex. 
 */
function onResultsMediapipe(results) {

  canvasCtx.clearRect(0, 0, videoElement.width, videoElement.height);
  canvasCtx.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
  if (results != null) {
    if (results.poseLandmarks != null && results.poseLandmarks.length > 0) {
      results.poseLandmarks = createAdditionalJoints(results.poseLandmarks);
      for (var i = 0; i < results.poseLandmarks.length; i++) {
        results.poseLandmarks[i].x = results.poseLandmarks[i].x * canvasElement.width;
        results.poseLandmarks[i].y = results.poseLandmarks[i].y * canvasElement.height;
      }
      updateScreen(results.poseLandmarks)
    }
    else {
      console.log("there are no pose landmarks")
      return;
    }
  }
}