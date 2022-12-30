// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electron', {
    ipcRenderer: {
        on(channel, func){
            const validChannels = ['send-token'];
            if(validChannels.includes(channel)){
                ipcRenderer.on(channel, (event, ...args) =>func(...args));
            }
        }
    }
})