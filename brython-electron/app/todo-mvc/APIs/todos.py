from flask import Blueprint, request, jsonify
from todo_mvc.utils import db
from todo_mvc.models.Todo import Todo

# api todos

todos = Blueprint('todos', __name__, url_prefix='/api/todos')

# endpoint for storing todo item
@todos.route('/', methods=['POST'])
def create():
    todo = Todo()
    todo.from_json(request.get_json())
    db.session.add(todo)
    db.session.commit()
    return todo_response(todo)

# endpoint for getting todo item
@todos.route('/<int:id>')
def read(id):
    todo = Todo.query.get_or_404(id)
    return todo_response(todo)

# endpoint for updating todo item
@todos.route('/<int:id>', methods=['PUT', 'PATCH'])
def update(id):
    todo = Todo.query.get_or_404(id)
    todo.from_json(request.get_json())
    db.session.commit()
    return todo_response(todo)

# endpoint for deleting todo item
@todos.route('/<int:id>', methods=['DELETE'])
def delete(id):
    Todo.query.filter_by(id=id).delete()
    db.session.commit()
    return jsonify()


# todo item response
def todo_response(todo):
    return jsonify(**todo.to_json())
