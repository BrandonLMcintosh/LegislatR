from flask import Flask
from routes.bills import bills
from routes.users import users
from routes.states import states
from routes.politicians import politicians

app = Flask(__name__)
app.register_blueprint(bills, url_prefix="/bills")
app.register_blueprint(users, url_prefix="/user")
app.register_blueprint(states, url_prefix="/states")
app.register_blueprint(politicians, url_prefix="/politicians")

