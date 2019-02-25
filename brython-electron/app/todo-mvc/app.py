from flask import Flask
from todo_mvc import settings
from todo_mvc.utils import db
from todo_mvc.controllers.home import home
from todo_mvc.APIs.todos import todos

# create flask app
app = Flask(__name__)

# configure render .pug to jinja
app.jinja_env.add_extension('pypugjs.ext.jinja.PyPugJSExtension')

# configure flask
app.config.from_object(settings)
app.config.from_envvar('TODO_SETTINGS', silent=True)

# configure database
db.init_app(app)

# register blueprint routes
app.register_blueprint(home)
app.register_blueprint(todos)

with app.app_context():
    db.create_all()

# run Flask app in debug mode
app.run()
