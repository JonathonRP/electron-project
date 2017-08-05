const py = require('')
const {remote} = require('electron')

var win = remote.getCurrentWindow()

def min(event):
    win.minimize()

document['minimize'].bind('click', min)
