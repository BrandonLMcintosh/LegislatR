from flask import Flask, render_template
from models_shared import db
from models.states import State
import logging

from keys import secret_key
from routes.bills import bills
from routes.users import users
from routes.states import states
from routes.politicians import politicians


app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///LGSLTR'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = False
app.config['SECRET_KEY'] = secret_key

db.app = app
db.init_app(app)

# db.drop_all()
# db.create_all()

State.Generate_States()

app.register_blueprint(bills, url_prefix="/bills")
app.register_blueprint(users, url_prefix="/user")
app.register_blueprint(states, url_prefix="/states")
app.register_blueprint(politicians, url_prefix="/politicians")


@app.route('/')
def index():
    return render_template('index.html')
