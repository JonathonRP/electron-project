from browser import document, window, alert

def addItem(event):
    if event.keyCode == 13:
        document.select(".new-todo")[0].value = ""

def toggle_all(event):
    alert("toggle all")

def clear_completed(event):
    alert("clear completed")

def creator(event):
    window.open('https://github.com/JonathonRP', 'electron', 'frame=true')

def TodoMVC(event):
    window.open('http://todomvc.com', 'electron', 'frame=true')

document.select(".new-todo")[0].bind('keypress', addItem)
document["toggle-all"].bind('click', toggle_all)
document["clear-completed"].bind('click', clear_completed)
document["creator"].bind('click', creator)
document["TodoMVC"].bind('click', TodoMVC)