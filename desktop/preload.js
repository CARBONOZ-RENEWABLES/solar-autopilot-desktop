const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // App info
  getVersion: () => ipcRenderer.invoke('get-version'),
  
  // System info
  getPlatform: () => process.platform,
  
  // File operations (if needed)
  openFile: () => ipcRenderer.invoke('open-file'),
  saveFile: (data) => ipcRenderer.invoke('save-file', data),
  
  // Notifications
  showNotification: (title, body) => ipcRenderer.invoke('show-notification', title, body)
});

// Expose a minimal API for the React app
window.isElectron = true;