from browser import document

def test(event):
    document["welcome"].text = "Hello World"

def reset(event):
    document["welcome"].text = "welcome"

document["speak"].bind("click", test)
document["reset"].bind("click", reset)