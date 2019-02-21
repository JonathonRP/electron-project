const {app, BrowserWindow} = require('electron')
const path = require('path')
const {ProtocolStatus, protocols} = require('./InternalProtocols')
const {ServerStatus, flask} = require('./Server')

let app_dir = '/app/'

async function createWindow() {

   ProtocolStatus.on('error', err => console.error('protocols failed', err))
   await protocols("setup", {pretty: true})

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

    ServerStatus.on("server needs to be started", async () => {

      console.log('server is starting...')
      await flask("start")
    })

    ServerStatus.on("running", () => {

      setTimeout(async () => {
        console.log('page is refreshing...')
        await flask("refresh page")
      }, 4200)
    })

    ServerStatus.once("page is loaded", (url) => {

      win.loadURL(url)
      win.webContents.openDevTools()
      win.once('ready-to-show', () => {
        win.show()
      })
    })

    ServerStatus.on("kill", (status_code, body) => {
      if (status_code == 505) {
        console.log(`${body}`)
      }
    })

    ServerStatus.on("killed", () => {
      app.quit()
      console.log('app is quiting...')
    })

    await flask("is server running?")
}

protocols("register")

app.on('ready', createWindow)

app.on('window-all-closed', async () => {
    if(process.platform !== 'darwin'){

      console.log('app is closing...')
      await flask("kill")
    }
})