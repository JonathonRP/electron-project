from flask import Blueprint, render_template, request
from todo_mvc.models.Todo import Todo

home = Blueprint('home', __name__)

# index route, shows index.pug view
@home.route('/')
def index():
    todos = Todo.query.all()
    todo_list = map(Todo.to_json, todos)
    return render_template('home.pug', pretty=True, tasks=todo_list)

# shutdown route, shutsdown server
@home.route('/shutdown', methods=['POST'])
def shutdown():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()
    return 'Server is shutting down...', 505
