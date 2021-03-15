from flask import Blueprint, session, request
from models.users import User

users = Blueprint("users", __name__, static_folder="static", template_folder="templates")

@users.route('/login', methods=["POST"])
def login():
    return 'login'


@users.route('/register', methods=["POST"])
def register():
    return "register"
    
@users.route('/logout', methods=["GET"])
def logout():
    return "logout"