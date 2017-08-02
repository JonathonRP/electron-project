const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

let win;

function createWindow(){
    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame: false
    })
    
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }))

    win.webContents.openDevTools()
}

app.on('ready', createWindow);