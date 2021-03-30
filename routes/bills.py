from flask import Blueprint
from models.bills import Bill

bills = Blueprint("bills", __name__, static_folder="static",
                  template_folder="templates")


@bills.route('/list')
def list():
    # followed bills
    return "list"


@bills.route('/<int:bill_id>')
def bill():
    # details on a specific bill
    return "bill"


@bills.route('/<int:bill_id>/like', methods=["POST"])
def bill_follow(bill_id):
    # follow a bill
    return "like"


@bills.route('/<int:bill_id>/comment', methods=["POST", "DELETE", "PATCH"])
def bill_comment(bill_id):
    # comment on a bill
    return "comment"
