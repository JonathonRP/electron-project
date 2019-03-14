const {spawn} = require('child_process')
const request = require('request')
const {EventEmitter} = require('events')
const logger = require('./logger')(__filename)

var Status = {
    CheckIfServerIsRunning: "are you running?",
    Error: 'error',
    Load: "load",
    ServerNeedsToBeStarted: "server needs to be started",
    Start: "start",
    Running: "running",
    Reload: "reload",
    Kill: "kill",
    Killed: "killed"
}
var Start = Status.Start
var Running = Status.Running
var Kill = Status.Kill
var base_url = 'http://localhost:5000'
let server

class Flask extends EventEmitter {

  constructor() {
    super()
  }

  Server(status) {
    var self = this
    if (status == Start) {
      self.Start()
    } else if (status == Kill) {
      self.Kill()
    } else if (status == Status.CheckIfServerIsRunning || status == Running) {
      request.get(base_url, function (resp) {

        self.emit(Status.Load, base_url)
      }).on('error', async function(e) {
  
        logger.error(e.message)
  
        if (e.message == "connect ECONNREFUSED 127.0.0.1:5000") {
          if(status == Status.CheckIfServerIsRunning) {
            self.emit(Status.ServerNeedsToBeStarted)
          } else {
            self.emit(Kill)
          }
        } else {
          self.emit(Kill)
        }
      })
    }
  }

  async Start() {
    try {
      var python_bin = "env/Scripts/python"
      server = await spawn(python_bin, ["-u", "app/run.py"])

      server.stdout.on('data', (data) => {
        logger.info(data.toString())
      })

      server.stderr.on('data', (data) => {
        logger.debug(data.toString())

        if (data.toString().includes("Running")) {
          this.emit(Status.Running)
        }
      })
    } catch (err) {
      logger.error(err)
      this.emit(Status.Error, err)
      return
    }
  }

  Kill() {

    request.post(`${base_url}/shutdown`,{
      todo: 'Shutdown Server'
    }, (error, resp, body) => {

      let status_code = resp.statusCode
      this.emit(Status.Kill, status_code, body)

      if (error) {
        logger.error(error)
        this.emit(Status.Error, error)
        return
      }

      this.emit(Status.Killed)
    })
  }
}

module.exports = Flask