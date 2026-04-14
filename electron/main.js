const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 980,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

 codex/develop-chat-app-with-audio/video-call-features-l9m9s2
  win.webContents.session.clearCache().finally(() => {
    win.loadURL('http://localhost:3000');
  });
}

app.whenReady().then(() => {
  app.commandLine.appendSwitch('disable-http-cache');

  win.loadURL('http://localhost:3000');
}

app.whenReady().then(() => {
 main
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

ipcMain.handle('backup:save', async (_event, { email, payload, customName }) => {
  const backupDir = path.join(app.getPath('documents'), 'DS-Chating-Backups');
  fs.mkdirSync(backupDir, { recursive: true });

  const cleanEmail = (email || 'user').replace(/[^a-z0-9_.-]/gi, '_');
  const filename = customName
    ? `${customName}.json`
    : `${cleanEmail}_${new Date().toISOString().slice(0, 10)}.json`;

  const filePath = path.join(backupDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(payload, null, 2), 'utf-8');
  return { ok: true, filePath };
});

ipcMain.handle('backup:restore', async () => {
  const result = await dialog.showOpenDialog({
    title: 'Restore Backup',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });

  if (result.canceled || !result.filePaths[0]) {
    return { ok: false, cancelled: true };
  }

  const content = fs.readFileSync(result.filePaths[0], 'utf-8');
  return { ok: true, payload: JSON.parse(content), filePath: result.filePaths[0] };
});
