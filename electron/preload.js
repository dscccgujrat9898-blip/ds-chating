const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  saveBackup: (data) => ipcRenderer.invoke('backup:save', data),
  restoreBackup: () => ipcRenderer.invoke('backup:restore')
});
