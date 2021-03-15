from flask import Blueprint, render_template
from models.states import State

states = Blueprint("states", __name__, static_folder="static", template_folder="templates")

@states.route("/list")
def list():
    return "list"

@states.route('/<int:state_id>')
def state(state_id):
    return "state"