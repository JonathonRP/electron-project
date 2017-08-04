from nodepy import Require

remote = require('electron').remote

win = remote.getCurrentWindow()

def min(event):
    win.minimize()

document['minimize'].bind('click', min)
