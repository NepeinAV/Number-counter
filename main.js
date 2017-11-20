const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

app.on('ready', () => {
    createWindow();
});

app.on('window-all-closed', function () {
    app.quit();
});

function createWindow() {
    appWindow = new BrowserWindow({
        width: 800,
        height: 800,
        resizable: false,
        autoHideMenuBar: true,
        useContentSize: true
    });
    appWindow.loadURL(`file://${__dirname}/index.html`);
};