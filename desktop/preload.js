// Preload script for Electron security
const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// specific features without exposing the whole of Node.js
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});
