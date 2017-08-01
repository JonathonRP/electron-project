const {app, BrowserWindow} = require('electron')
const path = require('path')
const url = require('url')

app.on('ready', function(){
    var mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        frame: false
    })
})