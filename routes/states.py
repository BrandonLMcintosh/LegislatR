from flask import Blueprint, render_template
from models.states import State

states = Blueprint("states", __name__, static_folder="static", template_folder="templates")

@states.route("/list")
def show():
    return render_template("states/list.html.j2")