from flask import Blueprint, session, request
from models.bills import Bill
from models.users import User

bills = Blueprint("bills", __name__, static_folder="static",
                  template_folder="templates")

@bills.route('/list')
def list():
    if User.is_logged_in():
        user = User.get(session['user_id'])
        return user.bills_data
    return User.authentication_error()


@bills.route('/<path:bill_id>')
def bill(bill_id):
    bill = Bill.get(bill_id)
    return bill.data


@bills.route('/<path:bill_id>/follow', methods=["POST"])
def bill_follow(bill_id):
    if User.is_logged_in():
        user = User.get(session['user_id'])
        return user.toggle_follow_bill(bill_id)
    return User.authentication_error()


@bills.route('/<path:bill_id>/comment', methods=["POST", "DELETE", "PATCH"])
def bill_comment(bill_id):
    data = request.get_json()
    text = data['text']
    if User.is_logged_in():
        user = User.get(session['user_id'])
        return user.comment(bill_id, text)
    return User.authentication_error()
