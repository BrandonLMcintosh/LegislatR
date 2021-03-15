from flask import Blueprint, render_template
from models.bills import Bill

bills = Blueprint("bills", __name__, static_folder="static",
                  template_folder="templates")


@bills.route('/list')
def list():
    return "list"


@bills.route('/<int:bill_id>')
def bill():
    return "bill"


@bills.route('/<int:bill_id>/like', methods=["POST"])
def bill_like(bill_id):
    return "like"


@bills.route('/<int:bill_id>/comment', methods=["POST", "DELETE", "PATCH"])
def bill_comment(bill_id):
    return "comment"
