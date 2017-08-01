const {app, BrowserWindow} = require('electron')

app.on('ready', function(){
    var mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame: false
    })
})