const {app, BrowserWindow} = require('electron')
const path = require('path')
const Url = require('url')
const Protocols = require('./settings_utils/InternalProtocols')
const Flask = require('./settings_utils/Server')
const logger = require('./settings_utils/logger')(__filename)

let app_dir = '/app/'
let flask = new Flask()

async function createWindow() {

    await Protocols("setup", {pretty: true}).catch(err => logger.error('protocols failed', err))

    let loading_win = new BrowserWindow({
      frame: false,
      transparent: true,
      alwaysOnTop: true
    })

    loading_win.loadURL(Url.format({protocol: 'pug', slashes: true, pathname: path.join(__dirname, app_dir, 'loading.pug')}))

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

      logger.verbose('server is starting...')
      await flask.Start()
    })

    flask.on("running", async () => {

      logger.verbose('loading...')
      await flask.Server("running")
    })

    flask.on("load", (url) => {

      win.loadURL(url)
      // win.webContents.openDevTools()

      win.once('ready-to-show', () => {
        win.show()

        win.webContents.once('dom-ready', () => {
          loading_win.close()
        })
      })
    })

    flask.on("kill", (status_code, body) => {

      logger.verbose('app is closing...')

      if (status_code == 505) {
        logger.info(`${body}`)
      }
    })

    flask.on("killed", () => {
      logger.verbose('app is quiting...')
      app.quit()
    })

    loading_win.once('show', () => {
      flask.Server("are you running?")
    })
    
    loading_win.maximize()
    loading_win.show()
}

Protocols("register")

app.on('ready', createWindow)

app.on('window-all-closed', async () => {

  if(process.platform !== 'darwin'){

    await flask.Kill()
  }
})