const {protocol} = require('electron')
const fs = require('fs')
const path = require('path')
const pug = require('pug')
const Url = require('url')
const mime = require('mime')
const {EventEmitter} = require('events')

const HTML_MIME = mime.getType('html')

class StatusEmitter extends EventEmitter {}
let ProtocolStatus = new StatusEmitter()

var Status = {
  Register: "register",
  Setup: "setup"
}

const getPath = url => {
    let parsed = Url.parse(url)
    let host = decodeURIComponent(parsed.hostname)
    let result = decodeURIComponent(parsed.pathname)
  
    // Local files in windows start with slash if no host is given
    // file:///c:/something.pug
    if (process.platform === 'win32' && !parsed.host.trim()) {
      result = result.substr(1)
    }

    return {
      host: host, 
      path: result,
      file: (host === './') ? result: host + result
    }
}

const Protocols = (status, options = {}) => (
  new Promise((resolve, reject) => {

    if (status == Status.Register) {

      protocol.registerStandardSchemes(['pug','app','todo-mvc'])
    } else if (status == Status.Setup) {
    
      let dirname = __dirname.split("\\", 3).join("\\")
      let img_dir = '/img/'
      let app_dir = '/app/'
      let todo_dir = 'todo_mvc/'

      protocol.registerBufferProtocol('pug', (request, result) => {
        let file = getPath(request.url).host + ':' + getPath(request.url).path
    
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

          ProtocolStatus.emit('error', err)
          return result(errorData)
        }
      }, err => err ? reject(err) : resolve(ProtocolStatus))

      protocol.registerFileProtocol('app', (request, callback) => {
        let host = getPath(request.url).host
        let Path = getPath(request.url).path
        let file = getPath(request.url).file

        try {
          if (host == 'node_modules') {
            Path = path.join(dirname, '/', file)
            callback({ path: Path})
          } else {
            Path = path.join(dirname, app_dir, file)
            callback({ path: Path})
          }
        } catch (err) {
          ProtocolStatus.emit('error', err)
          return callback({data: err})
        }
      }, err => err ? reject(err): resolve(err))

      protocol.registerFileProtocol('todo-mvc', (request, callback) => {
        let file = getPath(request.url).file

        try {
            callback({ path: path.join(dirname, app_dir, todo_dir, file)})
        } catch (err) {
          ProtocolStatus.emit('error', err)
          return callback({data: err})
        }
      }, err => err ? reject(err): resolve(err))

      protocol.registerFileProtocol('img', (request, callback) => {
        let file = getPath(request.url).file //test later
        try {
          callback({ path: path.join(dirname, img_dir, file)})
        } catch (err) {
          ProtocolStatus.emit('error', err)
          return callback({data: err})
        }
      }, err => err ? reject(err): resolve(err))
    }
  })
)

module.exports = Protocols