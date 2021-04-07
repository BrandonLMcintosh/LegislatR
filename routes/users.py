from flask import Blueprint, session, request, jsonify
from models.users import User

users = Blueprint("users", __name__, static_folder="static",
                  template_folder="templates")


@users.route('/login', methods=["POST"])
def login():

    data = request.get_json()

    username = data['username']
    password = data['password']

    return User.login(username, password)


@users.route('/register', methods=["POST"])
def register():
    data = request.get_json()

    username = data['username']
    password = data['password']
    phone = data['phone']
    state_id = data['state']

    return User.register(username, password, phone, state_id)


@users.route('/logout', methods=["GET"])
def logout():
    return User.logout()


@users.route('/<int:user_id>', methods=["GET"])
def get(user_id):
    if User.is_logged_in():
        user = User.get(user_id=user_id)
        response = {
            'user': user.data
        }
        return response
    return User.authentication_error()
    