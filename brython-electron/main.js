const {app, BrowserWindow, protocol} = require('electron')
const fs = require('fs')
const path = require('path')
const pug = require('pug')
const url = require('url')
const mime = require('mime')
const EventEmitter = require('events')

const HTML_MIME = mime.getType('html')

class PugEmitter extends EventEmitter {}

let win

var img_dir = '/img/'
var app_dir = '/app/'

const getPath = url => {
    let parsed = require('url').parse(url)
    let result = decodeURIComponent(parsed.pathname)
  
    // Local files in windows start with slash if no host is given
    // file:///c:/something.pug
    if (process.platform === 'win32' && !parsed.host.trim()) {
      result = result.substr(1)
    }
  
    return result
}

function setupProtocols(options = {}){
  new Promise((resolve, reject) => {
      let emitter = new PugEmitter()

      protocol.registerBufferProtocol('pug', (request, result) => {
        let file = getPath(request.url)
  
        // See if file actually exists
        try {
          let content = fs.readFileSync(file)
          let ext = path.extname(file)
          let data = {data: content, mimeType: mime.getType(ext)}
  
          if (ext === '.pug') {
            let compiled = pug.renderFile(file, options)
            data = {data: Buffer.from(compiled), mimeType: HTML_MIME}
          }
          
          return result(data)
        } catch (err) {
          // See here for error numbers:
          // https://code.google.com/p/chromium/codesearch#chromium/src/net/base/net_error_list.h
          let errorData
          if (err.code === 'ENOENT') {
            errorData = -6
          } else if (typeof err.code === 'number') {
            errorData = -2
          } else {
            // Remaining errors are considered to be pug errors
            // All errors wrt. Pug are rendered in browser
            errorData = {data: Buffer.from(`<pre style="tab-size:1">${err}</pre>`), mimeType: HTML_MIME}
          }
  
          emitter.emit('error', err)
          return result(errorData)
        }
      },
      err => err ? reject(err) : resolve(emitter))
    })
}

function createWindow() {

    setupProtocols({pretty: true})

    win = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            nodeIntegration: true,
            // preload: "preload-index.js",
            contextIsolation: false,
            webSecurity: true
        },
        frame: false
    })

    win.loadURL(url.format({
        pathname: path.join(__dirname, app_dir, 'index.pug'),
        protocol: 'pug:',
        slashes: true
    }))

    win.webContents.openDevTools()
}

protocol.registerStandardSchemes(['pug'])

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit();
    }
})