"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkUpdate = void 0;
const electron_1 = require("electron");
function checkUpdate() {
    electron_1.autoUpdater.on('checking-for-update', () => {
        console.log("checking-for-update");
    });
    electron_1.autoUpdater.on('update-available', () => {
        console.log("update-available");
    });
    electron_1.autoUpdater.on('update-not-available', () => {
        console.log("update-not-available");
    });
    electron_1.autoUpdater.on('error', (err) => {
        console.log("error: ", err.name, ": ", err.message);
    });
    /*autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
    })*/
    electron_1.autoUpdater.on('update-downloaded', (info) => {
        console.log("update-downloaded");
    });
    //autoUpdater.checkForUpdatesAndNotify();
    electron_1.autoUpdater.setFeedURL({
        url: "https://github.com/LucaCiucci/bicycle_posture_analyzer"
    });
    electron_1.autoUpdater.checkForUpdates();
}
exports.checkUpdate = checkUpdate;
