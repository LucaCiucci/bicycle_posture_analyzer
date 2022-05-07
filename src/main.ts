const { app, BrowserWindow } = require("electron");
import * as path from 'path'

import { checkUpdate } from './update'


app.on('ready', () => {
    console.log('App is ready');

    checkUpdate();

    const win = new BrowserWindow({
        // https://stackoverflow.com/questions/55093700/electron-5-0-0-uncaught-referenceerror-require-is-not-defined
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        width: 800,
        height: 600
    });

    win.loadFile(path.join(__dirname, '../index.html')).then(() => {
        //run();
        win.setTitle(win.getTitle() + " v" + app.getVersion());
    });
});