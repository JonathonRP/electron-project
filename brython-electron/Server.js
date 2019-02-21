const {spawn} = require('child_process')
const request = require('request')
const {EventEmitter} = require('events')

class StatusEmitter extends EventEmitter {}
let ServerStatus = new StatusEmitter()

var Status = {
    CheckServerIsRunning: "is server running?",
    Error: 'error',
    PageLoaded: "page is loaded",
    ServerNeedsToBeStarted: "server needs to be started",
    Start: "start",
    Running: "running",
    RefreshPage: "refresh page",
    Kill: "kill",
    Killed: "killed"
}
var Start = Status.Start
var Kill = Status.Kill
var base_url = 'http://localhost:5000'

const flask = (status) => (
  new Promise((resolve, reject) => {
    
    if (status == Start) {
      try {

        python_bin = "env/Scripts/python"
        var server = spawn(python_bin, ["app/todo-mvc/app.py"])
        
        server.stdout.on('data', (data) => {
          console.log(data.toString())
        })
        
        ServerStatus.emit(Status.Running)
      } catch (err) {

        ServerStatus.emit(Status.Error, err)
        return console.log(err)
      }
    }
    else if (status == Kill) {

      request.post(`${base_url}/shutdown`,{
        todo: 'Shutdown Server'
      }, (error, resp, body) => {

        let status_code = resp.statusCode
        ServerStatus.emit(Status.Kill, status_code, body)

        if (error) {
          console.error(error)
          ServerStatus.emit(Status.Error, error)
          return
        }

        ServerStatus.emit(Status.Killed)
      })
    } else {

      request.get(base_url, function (res) {
        
        ServerStatus.emit(Status.PageLoaded, base_url)
      }).on('error', async function(e) {

        console.error(e.message)

        if (e.message == "connect ECONNREFUSED 127.0.0.1:5000") {
          if(status == Status.CheckServerIsRunning) {
            ServerStatus.emit(Status.ServerNeedsToBeStarted)
          }
          else if (status == Status.RefreshPage) {
            ServerStatus.emit(Status.Running)
          } else {
            ServerStatus.emit(Kill)
          }
        } else {
          ServerStatus.emit(Kill)
        }
      })
    }
  })
)

module.exports = {
    ServerStatus,
    flask
}