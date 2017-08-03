const py = require('python-shell');
const {browser} = require('brython');
const {remote} = require('electron');

win = remote.getCurrentWindow();

py.run(browser.document['minimize'].bind('click', function(){
    win.minimize()
}));
