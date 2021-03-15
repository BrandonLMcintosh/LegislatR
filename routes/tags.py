from flask import Blueprint, render_template
from models.tags import Tag

tags = Blueprint("tags", __name__, static_folder="static", template_folder="templates")

@tags.route("/list")
def list():
    return "list"

@tags.route("/<int:tag_id>", methods=["GET", "DELETE"])
def tag():
    return "tag"
    
@tags.route('/add')
def tag_add():
    return "add"