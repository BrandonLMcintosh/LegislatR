from flask import Blueprint, render_template
from models.bills import Bill

bills = Blueprint("bills", __name__, static_folder="static", template_folder="templates")