from connect_db import db
from flask import json, jsonify


class Politician(db.Model):
    """Politician"""

    __tablename__ = 'politicians'

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)

    first_name = db.Column(db.Text, nullable=False)

    last_name = db.Column(db.Text, nullable=False)

    senator = db.Column(db.Boolean, nullable=False)

    party_id = db.Column(db.Integer, db.ForeignKey(
        'parties.id'), nullable=False)

    party = db.relationship('Party')

    state_id = db.Column(db.Integer, db.ForeignKey(
        'states.id'), nullable=False)

    state = db.relationship('State')

    sponsored_bills = db.relationship('Bill', secondary='bills_sponsors')

    @property
    def full_name(self):
        return self.first_name + self.last_name

    @property
    def data(self):
        data = {
            'full_name': self.full_name,
            'senator': self.senator,
            'party': self.party,
            'state': self.state,
            'sponsored_bills': self.sponsored_bills
        }

        response = jsonify(data)
        return response
