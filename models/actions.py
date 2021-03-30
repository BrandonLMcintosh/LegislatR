from models_shared import db
from flask import jsonify


class Action(db.Model):
    """Action"""

    __tablename__ = 'actions'

    def __repr__(self):
        return self.data

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    organization = db.Column(db.Text, nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False)
    order = db.Column(db.Integer, nullable=False)
    bill_id = db.Column(db.Text, db.ForeignKey(
        'bills.id'), nullable=False)

    @property
    def data(self):
        data = {
            'id': self.id,
            'organization': self.organization,
            'description': self.description,
            'order': self.order,
            'date': self.date,
            'bill': self.bill
        }

    @classmethod
    def get(cls, action_id):
        action = cls.query.get(action_id)
        return action
