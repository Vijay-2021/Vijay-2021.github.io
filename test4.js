
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
    if (!results.poseLandmarks) {
        return;
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(
        results.image, 0, 0, canvasElement.width, canvasElement.height);
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
        { color: '#00FF00', lineWidth: 0.5 });
    drawLandmarks(canvasCtx, results.poseLandmarks,
        { color: '#FF0000', lineWidth: 0.8 });
    canvasCtx.restore();
}


function onResults2(results) {
    
    if (!results.poseLandmarks) {
        return;
    }
    results.poseLandmarks = createAdditionalJoints(results.poseLandmarks);
    alert(results.poseLandmarks.length)
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    drawJoints(canvasCtx, results.poseLandmarks, canvasElement.width, canvasElement.height);

    drawConnections(canvasCtx, results.poseLandmarks, canvasElement.width, canvasElement.height);

    canvasCtx.restore();
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



function drawJoints(canvasCtx, poses, ctxwidth, ctxheight) {
    let width = ctxwidth;
    let height = ctxheight;


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

    let bodypart = fullbody;

    for (var i = 0; i < bodypart.length; i++) {
        canvasCtx.beginPath();
        canvasCtx.strokeStyle = "#01FD0C";
        canvasCtx.fillStyle = "#01FD0C";
        canvasCtx.lineWidth = 0.5;
        var g = new Path2D();
        g.arc(bodypart[i].x * width, bodypart[i].y * height, 1.0, 0, 2 * Math.PI);
        canvasCtx.fill(g);
        canvasCtx.stroke(g);
    }
    canvasCtx.restore();
}

//33-mid-shoulder, 34: mid-torse, 35: mid-hip, 36: mid_knee, 
//37: mid_ankle, 38: mid_left_torse, 39: mid_right_torso
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
    canvasCtx.lineWidth = 0.85;

    //Shoulder Segment
    canvasCtx.moveTo(shoulder[0].x * width, shoulder[0].y * height);
    canvasCtx.lineTo(shoulder[1].x * width, shoulder[1].y * height);
    canvasCtx.lineTo(shoulder[2].x * width, shoulder[2].y * height);

    //Right Hand Segment
    canvasCtx.moveTo(righthand[0].x * width, righthand[0].y * height);
    canvasCtx.lineTo(righthand[1].x * width, righthand[1].y * height);
    canvasCtx.lineTo(righthand[2].x * width, righthand[2].y * height);

    //Left Hand Segment
    canvasCtx.moveTo(lefthand[0].x * width, lefthand[0].y * height);
    canvasCtx.lineTo(lefthand[1].x * width, lefthand[1].y * height);
    canvasCtx.lineTo(lefthand[2].x * width, lefthand[2].y * height);

    //Middle Torso Segment
    canvasCtx.moveTo(middletorso[0].x * width, middletorso[0].y * height);
    canvasCtx.lineTo(middletorso[1].x * width, middletorso[1].y * height);
    canvasCtx.lineTo(middletorso[2].x * width, middletorso[2].y * height);

    //Hip Segment
    canvasCtx.moveTo(hip[0].x * width, hip[0].y * height);
    canvasCtx.lineTo(hip[1].x * width, hip[1].y * height);
    canvasCtx.lineTo(hip[2].x * width, hip[2].y * height);

    //Left Foot Segment
    canvasCtx.moveTo(leftLeg[0].x * width, leftLeg[0].y * height);
    canvasCtx.lineTo(leftLeg[1].x * width, leftLeg[1].y * height);
    canvasCtx.lineTo(leftLeg[2].x * width, leftLeg[2].y * height);
    canvasCtx.lineTo(leftLeg[3].x * width, leftLeg[3].y * height);

    //Right Foot Segment
    canvasCtx.moveTo(rightLeg[0].x * width, rightLeg[0].y * height);
    canvasCtx.lineTo(rightLeg[1].x * width, rightLeg[1].y * height);
    canvasCtx.lineTo(rightLeg[2].x * width, rightLeg[2].y * height);
    canvasCtx.lineTo(rightLeg[3].x * width, rightLeg[3].y * height);

    canvasCtx.stroke();
    canvasCtx.restore();
}

const pose = new Pose({locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
}});

pose.setOptions({
    upperBodyOnly: false,
    smoothLandmarks: true,
    modelComplexity: 1,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});

pose.onResults(onResults2);
alert("loaded pose sucessfully")
const camera = new Camera(videoElement, {

    onFrame: async () => {
        alert("got frame sucessfully")
        await pose.send({ image: videoElement });
    }
});
camera.start();