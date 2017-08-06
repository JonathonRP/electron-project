var python = require('python.js')
var document = python.import('browser').document
const {remote} = require('electron')

var win = remote.getCurrentWindow()

def min(event):
    win.minimize()

document['minimize'].bind('click', min)
