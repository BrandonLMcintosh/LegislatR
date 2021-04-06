from flask import Blueprint, session, request
from models.bills import Bill
from models.users import User

bills = Blueprint("bills", __name__, static_folder="static",
                  template_folder="templates")

@bills.route('/list')
def list():
    if User.is_logged_in():
        user = User.get(user_id=session['user_id'])
        response = {
            'bills':user.bills_following_long_data
        }
        return response
    return User.authentication_error()


@bills.route('/<path:bill_id>')
def bill(bill_id):
    bill = Bill.get(bill_id)
    response = {
        'bill':bill.data
    }
    return response


@bills.route('/<path:bill_id>/follow', methods=["POST"])
def bill_follow(bill_id):
    if User.is_logged_in():
        user = User.get(user_id=session['user_id'])
        return user.toggle_follow_bill(bill_id)
    return User.authentication_error()


@bills.route('/<path:bill_id>/comment', methods=["POST"])
def bill_comment(bill_id):
    data = request.get_json()
    text = data['text']
    if User.is_logged_in():
        user = User.get(user_id=session['user_id'])
        return user.comment(bill_id, text)
    return User.authentication_error()

@bills.route('/<path:bill_id>/tag', methods=["POST"])
def bill_tag(bill_id):
    data = request.get_json()
    tag_name = data['tag_name']
    if User.is_logged_in():
        bill = Bill.get(bill_id)
        return bill.toggle_tag(tag_name=tag_name)
        
