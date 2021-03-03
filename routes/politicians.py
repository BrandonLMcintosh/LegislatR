from flask import Blueprint, render_template
from models.senators import Senator
from models.representatives import Representative

politicians = Blueprint("politicians", __name__, static_folder="static", template_folder="templates")