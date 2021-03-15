from flask import Blueprint, render_template
from models.users import User

users = Blueprint("users", __name__, static_folder="static", template_folder="templates")

@users.route('/login')
def login():
    return "login"

@users.route('/register')
def register():
    return "register"
    
@users.route('/logout')
def logout():
    return "logout"