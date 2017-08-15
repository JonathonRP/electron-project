var python = require('python.node')
const {remote} = require('electron')
const {browser} = python.import('browser')

var win = remote.getCurrentWindow();

browser.document['minimize'].click( function(){
    win.minimize()
});
