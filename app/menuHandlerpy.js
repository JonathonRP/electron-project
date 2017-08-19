const brython = require('brython')
const {remote} = require('electron')

let win = remote.getCurrentWindow();


with (brython()){
from browser import document

def min():
    win.minimize()

def max():
    if not win.isMaximized()
        win.maximize()
    else
        win.unmaximize()

def close():
    win.close()

document['minimize'].bind(click, min);
document['maximize'].bind(click, max);
document['close'].bind(click, close);
}