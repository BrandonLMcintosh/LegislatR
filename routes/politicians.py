from flask import Blueprint
from models.politicians import Politician

politicians = Blueprint("politicians", __name__,
                        static_folder="static", template_folder="templates")


@politicians.route('/<int:politician_id>')
def get(politician_id):
    politician = Politician.get(politician_id)
    response = {
        'politician': politician.data
    }
    return response
