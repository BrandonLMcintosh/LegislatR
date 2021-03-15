from flask import Blueprint, render_template
from models.politicians import Politician

politicians = Blueprint("politicians", __name__,
                        static_folder="static", template_folder="templates")
