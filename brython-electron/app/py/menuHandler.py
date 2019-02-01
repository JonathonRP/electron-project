from browser import document, window, html

remote = window.Electron.remote
win = remote.getCurrentWindow()

document["titleshown"] <= document["title"].text

def min(event):
    win.minimize()

def max(event):
    if not win.isMaximized():
        win.maximize()
    else:
        win.unmaximize()

def close(event):
    win.close()

document["minimize"].bind("click", min)
document["maximize"].bind("click", max)
document["close"].bind("click", close)