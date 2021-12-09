
import { Pose, Results, POSE_CONNECTIONS } from '@mediapipe/pose'
import { Options as PoseOptions } from '@mediapipe/pose'
import { Camera } from '@mediapipe/camera_utils'
import '@mediapipe/control_utils'
//import '@mediapipe/control_utils_3d'
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils'
import { drawAngleBetweenKeypoints, intersection2LinesFromPoints, vFromXY } from './utils'
import { ControlPanel } from '@mediapipe/control_utils'
import * as path from 'path'

console.log("Hello There!");

const videoElement = document.getElementsByClassName('input_video')[0] as HTMLVideoElement;
const videoElement2 = document.getElementsByClassName('input_video')[1] as HTMLVideoElement;
const canvasElement = document.getElementsByClassName('output_canvas')[0] as HTMLCanvasElement;
const canvasCtx = canvasElement.getContext('2d');
const controlsElement = document.getElementsByClassName('control-panel')[0] as HTMLDivElement;
const displayElement = document.getElementsByClassName('display')[0] as HTMLDivElement;
const sideSelectElement = document.getElementById('side') as HTMLSelectElement;

var videoFileOpt = false;

var pose = new Pose({
    locateFile: (file) => {
            return path.join(__dirname, "../node_modules/@mediapipe/pose/" + file);
        }
    });
pose.setOptions({
    modelComplexity: 2,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
pose.onResults((results : Results) : void => {
    //console.log(results);
    if (canvasCtx)
    {
        canvasCtx.save();


        const aspect = videoElement.videoHeight / videoElement.videoWidth;
        let width: number, height: number;
        let rect = displayElement.getBoundingClientRect();
        if (rect.width > rect.height) {
            height = rect.height;
            width = height / aspect;
        } else {
            width = rect.width;
            height = width * aspect;
        }
        canvasElement.width = width;
        canvasElement.height = height;
        canvasElement.style.top = ((rect.height - height) / 2).toString() + "px";
        canvasElement.style.left = ((rect.width - width) / 2).toString() + "px";

        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

        if (0)
        {
            canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);

            // Only overwrite existing pixels.
            canvasCtx.globalCompositeOperation = 'source-in';
            canvasCtx.fillStyle = '#00FF00';
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);

            // Only overwrite missing pixels.
            canvasCtx.globalCompositeOperation = 'destination-atop';
        }
        if(0)
        canvasCtx.drawImage(
            results.image, 0, 0, canvasElement.width, canvasElement.height);

        //canvasCtx.globalCompositeOperation = 'source-over';
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {color: '#00FF00', lineWidth: 4});
        //drawLandmarks(canvasCtx, results.poseLandmarks,{color: '#FF0000', lineWidth: 2});

        //drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 1, 0, 3, 7);
        //drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 14, 12, 14, 16);

        if (sideSelectElement.value == "right") {
            drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 30, 32, 28, 26);
            drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 14, 12, 14, 16);
            drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 24, 26, 24, 12);
            drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 26, 24, 26, 28);
            drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 12, 14, 12, 24);
        }
        if (sideSelectElement.value == "left") {
            drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 29, 31, 27, 25);
            drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 13, 11, 13, 15);
            drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 23, 25, 23, 11);
            drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 25, 23, 25, 27);
            drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 11, 13, 11, 23);
        }

        canvasCtx.restore();
    }
});

let camera : Camera | null = new Camera(videoElement, {
    onFrame: async () => {
        //console.log(videoElement);
        if (videoFileOpt)
        {
            // TODO IF PAUSE
            //pose.reset();
            await pose.send({image: videoElement2});
        }
        else
            await pose.send({image: videoElement});
        //pose.send({image: videoElement});
        //pose.send({image: new Image()});
    }//,
    //width: 1280,
    //height: 720
});

console.log(camera.start());

let fileIn = document.getElementById('file-input') as HTMLInputElement;
if (fileIn)
{
    fileIn.addEventListener('change', async () => {
        // https://stackoverflow.com/questions/8885701/play-local-hard-drive-video-file-with-html5-video-tag
        if (fileIn.files)
        {
            let file = fileIn.files[0];
            if (file) {
                videoElement.setAttribute('src', URL.createObjectURL(file));
                videoElement.srcObject = null;
                /*camera.stop().then(()=>{
                    videoElement.setAttribute('src', URL.createObjectURL(file));
                })*/
                /*setInterval(async()=>{await pose.send({image: videoElement});}, 50);*/
                //videoFileOpt = true;
                //videoElement.srcObject = videoElement2.srcObject;
                //videoElement.src = videoElement2.src;
                await videoElement.play();
                pose.reset();
            }
        }
    }, false);
}

//videoElement.addEventListener('change')
//setInterval(async ()=>{ await pose.send({image: videoElement});}, 5000); 