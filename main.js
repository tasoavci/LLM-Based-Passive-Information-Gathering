const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 600,
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });
    win.loadFile(path.join(__dirname, 'renderer/index.html'));
}

app.whenReady().then(createWindow);

ipcMain.handle('run-osint', async (_evt, { company, domain }) => {
    const { runPipeline } = require('./src/logic/pipeline');
    return await runPipeline(company, domain);
});