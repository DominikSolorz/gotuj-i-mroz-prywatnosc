const { app, BrowserWindow, net, protocol, session } = require('electron');
const { mkdirSync } = require('node:fs');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const gameUrl = 'kitchen://game/index.html';
const localFiles = app.isPackaged ? path.join(__dirname, 'www') : path.join(__dirname, '..', 'www');
const profile = path.join(app.isPackaged ? path.dirname(process.execPath) : __dirname, 'Zapis gry');
mkdirSync(profile, { recursive: true });
app.setPath('userData', profile);
app.setPath('sessionData', profile);
app.setPath('crashDumps', profile);
protocol.registerSchemesAsPrivileged([{ scheme: 'kitchen', privileges: { standard: true, secure: true } }]);

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  let window;
  app.on('second-instance', () => {
    if (window?.isMinimized()) window.restore();
    window?.focus();
  });
  app.whenReady().then(async () => {
    session.defaultSession.webRequest.onBeforeRequest(
      { urls: ['http://*/*', 'https://*/*', 'ws://*/*', 'wss://*/*'] },
      (_request, respond) => respond({ cancel: true }),
    );
    protocol.handle('kitchen', (request) => {
      try {
        const url = new URL(request.url);
        const target = path.resolve(localFiles, '.' + decodeURIComponent(url.pathname));
        const relative = path.relative(localFiles, target);
        if (url.host !== 'game' || relative.startsWith('..') || path.isAbsolute(relative)) {
          return new Response(null, { status: 404 });
        }
        return net.fetch(pathToFileURL(target).href);
      } catch {
        return new Response(null, { status: 400 });
      }
    });
    window = new BrowserWindow({
      width: 1280,
      height: 800,
      minWidth: 640,
      minHeight: 480,
      title: 'Gotuj i Mroź',
      autoHideMenuBar: true,
      backgroundColor: '#2a1712',
      webPreferences: { sandbox: true, contextIsolation: true },
    });
    window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
    window.webContents.on('will-navigate', (event) => event.preventDefault());
    await window.loadURL(gameUrl);
  }).catch((error) => {
    require('node:fs').writeFileSync(path.join(profile, 'blad-uruchomienia.log'), String(error));
    app.exit(1);
  });
  app.on('window-all-closed', () => app.quit());
}
