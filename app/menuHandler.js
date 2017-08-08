var python = require('rapydscript-ng');
const {remote} = require('electron');

var win = remote.getCurrentWindow();

def min(event):
    win.minimize()

document.getElementById('minimize').click(min());
