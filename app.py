from flask import Flask
from connect_db import connect_db


from routes.bills import bills
from routes.users import users
from routes.states import states
from routes.politicians import politicians


app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///LGSLTR'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True


connect_db(app)


app.register_blueprint(bills, url_prefix="/bills")
app.register_blueprint(users, url_prefix="/user")
app.register_blueprint(states, url_prefix="/states")
app.register_blueprint(politicians, url_prefix="/politicians")

