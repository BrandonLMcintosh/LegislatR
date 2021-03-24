from models_shared import db
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

    @property
    def data(self):
        data = {
            'db_id': self.id,
            'organization': self.organization,
            'description': self.description,
            'date': self.date,
            'bill': self.bill
        }

    @classmethod
    def get(cls, action_id):
        action = cls.query.get(action_id)
        return action
