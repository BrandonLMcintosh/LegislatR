from flask import Blueprint, request, session
from models.tags import Tag
from models.users import User

tags = Blueprint("tags", __name__, static_folder="static",
                 template_folder="templates")


@tags.route("/list")
def list():
    return Tag.get_all()


@tags.route("/<int:tag_id>")
def tag(tag_id):
    tag = Tag.get(tag_id=tag_id)
    response = {
        'tag': tag.data
    }
    return response


@tags.route('/create', methods=['POST'])
def tag_add():
    if User.is_logged_in():
        data = request.get_json()
        name = data['tag_name']
        return Tag.add(name=name)
    return User.authentication_error()


@tags.route('/<int:tag_id>/follow', methods=["POST"])
def tag_follow(tag_id):
    if User.is_logged_in():
        user_id = session['user_id']
        user = User.get(user_id=user_id)
        return user.toggle_follow_tag(tag_id)
    return User.authentication_error()
