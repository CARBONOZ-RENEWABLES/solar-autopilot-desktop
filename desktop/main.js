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
    // Load embedded HTML directly
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>CARBONOZ SolarAutopilot</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, sans-serif; margin: 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 2rem; }
        .card { background: rgba(255,255,255,0.1); border-radius: 10px; padding: 20px; margin: 20px 0; }
        .status { display: flex; justify-content: space-between; align-items: center; }
        .btn { background: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌞 CARBONOZ SolarAutopilot</h1>
          <p>AI-Powered Solar Battery Management System</p>
        </div>
        
        <div class="card">
          <h2>System Status</h2>
          <div class="status">
            <span>Backend Server: <span id="backend-status">Checking...</span></span>
            <button class="btn" onclick="checkStatus()">Refresh</button>
          </div>
        </div>
        
        <div class="card">
          <h2>Quick Actions</h2>
          <button class="btn" onclick="alert('AI Charging optimization started!')">Start AI Optimization</button>
          <button class="btn" onclick="alert('Energy monitoring activated!')">Monitor Energy</button>
          <button class="btn" onclick="alert('CO2 tracking enabled!')">Track CO2 Offset</button>
        </div>
        
        <div class="card">
          <h2>Energy Dashboard</h2>
          <p>Solar Production: <strong>2.4 kW</strong></p>
          <p>Battery Level: <strong>85%</strong></p>
          <p>Grid Usage: <strong>0.8 kW</strong></p>
          <p>CO2 Saved Today: <strong>12.5 kg</strong></p>
        </div>
      </div>
      
      <script>
        async function checkStatus() {
          try {
            const response = await fetch('http://localhost:3001/api/status');
            const data = await response.json();
            document.getElementById('backend-status').textContent = 'Connected ✅';
          } catch (e) {
            document.getElementById('backend-status').textContent = 'Disconnected ❌';
          }
        }
        checkStatus();
        setInterval(checkStatus, 5000);
      </script>
    </body>
    </html>
    `;
    
    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent));
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