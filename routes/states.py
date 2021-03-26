from flask import Blueprint, render_template
from models.states import State

states = Blueprint("states", __name__, static_folder="static",
                   template_folder="templates")


@states.route("/list")
def list():
    return State.get_all()


@states.route('/<int:state_code>')
def state(state_code):
    state = State.get(state_code)
    return state.data
