const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    title: 'VPN App',
    icon: path.join(__dirname, 'assets/icon.png'),
    autoHideMenuBar: true,
    resizable: true
  });

  mainWindow.loadFile('index.html');

  // باز کردن DevTools در حالت Development
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers (برای ارتباط با Renderer Process)
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

