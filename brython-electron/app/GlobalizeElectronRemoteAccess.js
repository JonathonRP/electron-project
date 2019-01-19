    //GlobalizeElectronRemoteAccess.js
    const {remote} = require("electron");

    Electron = {
        remote: remote
    }
//|_______________________________________________________
    //menuHandler.js
// const $ = require('jquery')
// const {remote} = require('electron')

// var win = remote.getCurrentWindow();

// function min(){
//     win.minimize();
// }

// function max(){
//     if(!win.isMaximized()){
//         win.maximize();
//     }
//     else{
//         win.unmaximize();
//     }
// }

// function close(){
//     win.close();
// }

// $('#minimize').click(min);
// $('#maximize').click(max);
// $('#close').click(close);
//|_______________________________________________________
    //Electron.remote.getCurrentWindow.js
// const {remote} = require("electron");

// Electron = {
//     remote:static = {
//         getCurrentWindow:function(){
//             return remote.getCurrentWindow();
//     }}
// };
//|_______________________________________________________