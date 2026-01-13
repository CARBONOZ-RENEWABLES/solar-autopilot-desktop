const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const express = require('express');
const cors = require('cors');

let mainWindow;
let server;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    icon: path.join(__dirname, 'assets/icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    show: false
  });

  // Load the React app
  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Try multiple possible paths for the frontend
    const frontendPaths = [
      path.join(__dirname, '../frontend/dist/index.html'),
      path.join(__dirname, 'frontend/dist/index.html'),
      path.join(__dirname, 'dist/index.html')
    ];
    
    let loaded = false;
    for (const frontendPath of frontendPaths) {
      try {
        if (require('fs').existsSync(frontendPath)) {
          mainWindow.loadFile(frontendPath);
          loaded = true;
          break;
        }
      } catch (e) {}
    }
    
    if (!loaded) {
      // Fallback to a simple HTML page
      mainWindow.loadURL('data:text/html,<html><body><h1>CARBONOZ SolarAutopilot</h1><p>Frontend loading...</p><script>setTimeout(() => location.reload(), 2000)</script></body></html>');
    }
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

function startBackend() {
  if (!server) {
    const app = express();
    app.use(cors());
    app.use(express.json());
    
    // Basic API endpoints
    app.get('/api/health', (req, res) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
    
    app.get('/api/status', (req, res) => {
      res.json({ 
        app: 'CARBONOZ SolarAutopilot',
        version: '1.0.0',
        status: 'running'
      });
    });
    
    server = app.listen(3001, () => {
      console.log('Backend server running on port 3001');
    });
  }
}

function stopBackend() {
  if (server) {
    server.close();
    server = null;
  }
}

// App event handlers
app.whenReady().then(() => {
  createWindow();
  startBackend();
  
  // Auto updater
  autoUpdater.checkForUpdatesAndNotify();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  stopBackend();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopBackend();
});

// Menu
const template = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
        click: () => app.quit()
      }
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About CARBONOZ SolarAutopilot',
        click: () => {
          shell.openExternal('https://carbonoz.com');
        }
      }
    ]
  }
];

Menu.setApplicationMenu(Menu.buildFromTemplate(template));

// Auto updater events
autoUpdater.on('update-available', () => {
  console.log('Update available');
});

autoUpdater.on('update-downloaded', () => {
  console.log('Update downloaded');
  autoUpdater.quitAndInstall();
});