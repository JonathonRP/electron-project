from browser import document, window

def addItem(event):
    if event.keyCode == 13:
        document.select(".main")[0].classList.remove("hidden")
        document.select(".footer")[0].classList.remove("hidden")
        document.select(".new-todo")[0].value = ""

def creator(event):
    window.open('https://github.com/JonathonRP', 'electron', 'frame=true')

def TodoMVC(event):
    window.open('http://todomvc.com', 'electron', 'frame=true')

document.select(".new-todo")[0].bind('keypress', addItem)
document["creator"].bind('click', creator)
document["TodoMVC"].bind('click', TodoMVC)