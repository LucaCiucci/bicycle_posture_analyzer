"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pose_1 = require("@mediapipe/pose");
const camera_utils_1 = require("@mediapipe/camera_utils");
require("@mediapipe/control_utils");
//import '@mediapipe/control_utils_3d'
const drawing_utils_1 = require("@mediapipe/drawing_utils");
const utils_1 = require("./utils");
const path = __importStar(require("path"));
console.log("Hello There!");
const videoElement = document.getElementsByClassName('input_video')[0];
const videoElement2 = document.getElementsByClassName('input_video')[1];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const canvasCtx = canvasElement.getContext('2d');
const controlsElement = document.getElementsByClassName('control-panel')[0];
const displayElement = document.getElementsByClassName('display')[0];
const sideSelectElement = document.getElementById('side');
var videoFileOpt = false;
var pose = new pose_1.Pose({
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
pose.onResults((results) => {
    //console.log(results);
    if (canvasCtx) {
        canvasCtx.save();
        const aspect = videoElement.videoHeight / videoElement.videoWidth;
        let width, height;
        let rect = displayElement.getBoundingClientRect();
        if (rect.width > rect.height) {
            height = rect.height;
            width = height / aspect;
        }
        else {
            width = rect.width;
            height = width * aspect;
        }
        canvasElement.width = width;
        canvasElement.height = height;
        canvasElement.style.top = ((rect.height - height) / 2).toString() + "px";
        canvasElement.style.left = ((rect.width - width) / 2).toString() + "px";
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        if (0) {
            canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);
            // Only overwrite existing pixels.
            canvasCtx.globalCompositeOperation = 'source-in';
            canvasCtx.fillStyle = '#00FF00';
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
            // Only overwrite missing pixels.
            canvasCtx.globalCompositeOperation = 'destination-atop';
        }
        if (0)
            canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
        //canvasCtx.globalCompositeOperation = 'source-over';
        (0, drawing_utils_1.drawConnectors)(canvasCtx, results.poseLandmarks, pose_1.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 4 });
        //drawLandmarks(canvasCtx, results.poseLandmarks,{color: '#FF0000', lineWidth: 2});
        //drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 1, 0, 3, 7);
        //drawAngleBetweenKeypoints(canvasElement, canvasCtx, results, 14, 12, 14, 16);
        if (sideSelectElement.value == "right") {
            (0, utils_1.drawAngleBetweenKeypoints)(canvasElement, canvasCtx, results, 30, 32, 28, 26);
            (0, utils_1.drawAngleBetweenKeypoints)(canvasElement, canvasCtx, results, 14, 12, 14, 16);
            (0, utils_1.drawAngleBetweenKeypoints)(canvasElement, canvasCtx, results, 24, 26, 24, 12);
            (0, utils_1.drawAngleBetweenKeypoints)(canvasElement, canvasCtx, results, 26, 24, 26, 28);
            (0, utils_1.drawAngleBetweenKeypoints)(canvasElement, canvasCtx, results, 12, 14, 12, 24);
        }
        if (sideSelectElement.value == "left") {
            (0, utils_1.drawAngleBetweenKeypoints)(canvasElement, canvasCtx, results, 29, 31, 27, 25);
            (0, utils_1.drawAngleBetweenKeypoints)(canvasElement, canvasCtx, results, 13, 11, 13, 15);
            (0, utils_1.drawAngleBetweenKeypoints)(canvasElement, canvasCtx, results, 23, 25, 23, 11);
            (0, utils_1.drawAngleBetweenKeypoints)(canvasElement, canvasCtx, results, 25, 23, 25, 27);
            (0, utils_1.drawAngleBetweenKeypoints)(canvasElement, canvasCtx, results, 11, 13, 11, 23);
        }
        canvasCtx.restore();
    }
});
let camera = new camera_utils_1.Camera(videoElement, {
    onFrame: () => __awaiter(void 0, void 0, void 0, function* () {
        //console.log(videoElement);
        if (videoFileOpt) {
            // TODO IF PAUSE
            //pose.reset();
            yield pose.send({ image: videoElement2 });
        }
        else
            yield pose.send({ image: videoElement });
        //pose.send({image: videoElement});
        //pose.send({image: new Image()});
    }) //,
    //width: 1280,
    //height: 720
});
console.log(camera.start());
let fileIn = document.getElementById('file-input');
if (fileIn) {
    fileIn.addEventListener('change', () => __awaiter(void 0, void 0, void 0, function* () {
        // https://stackoverflow.com/questions/8885701/play-local-hard-drive-video-file-with-html5-video-tag
        if (fileIn.files) {
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
                yield videoElement.play();
                pose.reset();
            }
        }
    }), false);
}
//videoElement.addEventListener('change')
//setInterval(async ()=>{ await pose.send({image: videoElement});}, 5000); 
