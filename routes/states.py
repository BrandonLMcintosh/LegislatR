from flask import Blueprint
from models.states import State

states = Blueprint("states", __name__, static_folder="static",
                   template_folder="templates")


@states.route("/list")
def list():
    return State.get_all()


@states.route('/<path:state_id>')
def state(state_id):
    state = State.get(state_id)
    return state.data


@states.route('/<path:state_id>/bills')
def state_bills(state_id):
    state = State.get(state_id)
    return state.bills_data
