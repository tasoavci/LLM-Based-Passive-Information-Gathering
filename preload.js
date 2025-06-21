const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    runOSINT: (params) => ipcRenderer.invoke('run-osint', params),
});