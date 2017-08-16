const $ = require('jquery')
const {remote} = require('electron')

var win = remote.getCurrentWindow();

function min(){
    win.minimize();
}

function max(){
    if(!win.isMaximized()){
        win.maximize();
    }
    else{
        win.unmaximize();
    }
}

function close(){
    win.close();
}

$('#minimize').click(min);
$('#maximize').click(max);
$('#close').click(close);