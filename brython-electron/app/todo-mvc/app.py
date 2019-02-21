from flask import Flask, render_template, request, jsonify
import json

# create flask app
app = Flask(__name__)

# configure firebase firestore

# configure render .pug to jinja
app.jinja_env.add_extension('pypugjs.ext.jinja.PyPugJSExtension')

tasks = [
    {
        "title": "Mow the lawn",
        "complete": False
    },{
        "title": "Clean Garage",
        "complete": True
    },{
        "title": "Pet a Unicorn",
        "complete": False
    }
]

tasks2 = [
    {
        "title": "Mow the lawn",
        "complete": False
    },{
        "title": "Clean",
        "complete": True
    },{
        "title": "Pet a Unicorn",
        "complete": False
    }
]

# index route, shows index.pug view
@app.route('/')
def index():
    selection = None
    return render_template('index.pug', pretty=True, tasks=tasks, select=selection)
# active route, shows index.pug filter to active todos view
@app.route('/active')
def active():
    selection = "active"
    return render_template('index.pug', pretty=True, tasks=tasks2, select=selection)

# endpoint for storing todo item
@app.route('/add-todo', methods = ['POST'])
def addTodo():
    data = json.loads(request.data) # load JSON data from request
    # pusher.trigger('todo', 'item-added', data) # trigger `item-added` event on `todo` channel
    return jsonify(data)

# endpoint for deleting todo item
@app.route('/remove-todo/<item_id>')
def removeTodo(item_id):
    data = {'id': item_id }
    # pusher.trigger('todo', 'item-removed', data)
    return jsonify(data)

# endpoint for updating todo item
@app.route('/update-todo/<item_id>', methods = ['POST'])
def updateTodo(item_id):
    data = {
    'id': item_id,
    'completed': json.loads(request.data).get('completed', 0)
    }
    # pusher.trigger('todo', 'item-updated', data)
    return jsonify(data)

@app.route('/shutdown', methods=['POST'])
def shutdown():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Not running with the Werkzeug Server')
    func()
    return 'Server is shutting down...', 505

# run Flask app in debug mode
app.run(debug=True)