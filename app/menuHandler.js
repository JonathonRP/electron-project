var python = require('python.node')
const {remote} = require('electron')
var brython = require('brython')
var browser = python.import('browser')

var win = remote.getCurrentWindow();

browser.document['minimize'].bind( click, function(){
    win.minimize()
});
