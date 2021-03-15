from flask import Blueprint, render_template
from models.users import User

messages = Blueprint("messages", __name__,
                     static_folder="static", template_folder="templates")
