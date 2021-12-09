import { app, BrowserWindow } from 'electron';
import * as path from 'path'

app.on('ready', () => {
  console.log('App is ready');

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
  });
});