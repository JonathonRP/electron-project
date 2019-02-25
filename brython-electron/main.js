const {app, BrowserWindow} = require('electron')
const path = require('path')
const Protocols = require('./InternalProtocols')
const Flask = require('./Server')

let app_dir = '/app/'
let flask = new Flask()

async function createWindow() {

    await Protocols("setup", {pretty: true}).catch(err => console.error('protocols failed', err))

    let win = new BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 500,
        minHeight: 666,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            preload: path.join(__dirname, app_dir, 'electron.js'),
            webSecurity: true
        },
        frame: false,
        show: false
    })

    // win.loadURL(Url.format({
    //     pathname: path.join(__dirname, app_dir, 'index.pug'),
    //     protocol: 'pug:',
    //     slashes: true
    // }))

    flask.on("server needs to be started", async () => {

      console.log('server is starting...')
      await flask.Start()
    })

    flask.on("running", async (status) => {

      console.log('loading...')
      await flask.Server("running")
    })

    flask.on("load", (url) => {

      win.loadURL(url)
      win.webContents.openDevTools()
      win.once('ready-to-show', () => {
        win.show()
      })
    })

    flask.on("kill", (status_code, body) => {

      console.log('app is closing...')

      if (status_code == 505) {
        console.log(`${body}`)
      }
    })

    flask.on("killed", () => {
      console.log('app is quiting...')
      app.quit()
    })
  
    flask.Server("are you running?")
}

Protocols("register")

app.on('ready', createWindow)

app.on('window-all-closed', async () => {

  if(process.platform !== 'darwin'){

    await flask.Kill()
  }
})