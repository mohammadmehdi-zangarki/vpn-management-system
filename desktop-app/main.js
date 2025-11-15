const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { exec } = require('child_process');

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

// قبل از بستن برنامه، v2ray و Proxy را پاک کن
app.on('before-quit', async (event) => {
  console.log('در حال پاکسازی قبل از خروج...');
  
  try {
    // کشتن تمام v2ray processes
    exec('taskkill /F /IM v2ray.exe', (error) => {
      if (!error) {
        console.log('✓ v2ray بسته شد');
      }
    });
    
    // غیرفعال کردن System Proxy
    exec('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Internet Settings" /v ProxyEnable /t REG_DWORD /d 0 /f', (error) => {
      if (!error) {
        console.log('✓ Proxy غیرفعال شد');
      }
    });
  } catch (error) {
    console.error('خطا در پاکسازی:', error);
  }
});

// IPC Handlers (برای ارتباط با Renderer Process)
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

