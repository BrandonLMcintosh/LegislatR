from connect_db import db
from flask import jsonify


class Action(db.Model):
    """Action"""

    __tablename__ = 'actions'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    organization = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False)
    bill_id = db.Column(db.Integer, db.ForeignKey(
        'bills.id'), nullable=False)
    bill = db.relationship("Bill")
